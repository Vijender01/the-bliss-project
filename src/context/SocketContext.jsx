import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [lastOrderEvent, setLastOrderEvent] = useState(null);
    const audioRef = useRef(null);

    // Preload audio on first user interaction
    useEffect(() => {
        const preload = () => {
            if (!audioRef.current) {
                audioRef.current = new Audio('/alert.wav');
                audioRef.current.volume = 0.8;
                audioRef.current.load();
            }
            window.removeEventListener('click', preload);
        };
        window.addEventListener('click', preload);
        return () => window.removeEventListener('click', preload);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        let socketUrl;
        if (API_URL.startsWith('/')) {
            socketUrl = window.location.origin;
        } else {
            socketUrl = API_URL.replace(/\/api\/?$/, '');
        }

        console.log(`🔌 Connecting socket to: ${socketUrl} (role: ${user.role})`);

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ['websocket'], // Pure WebSocket for faster iPad/Safari upgrade
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2000,
            reconnectionAttempts: Infinity, // Keep retrying if backgrounded
            path: '/socket.io/',
            timeout: 20000,
        });

        // Handle iOS background/suspend by triggering refetch on resume
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('🔄 App resumed - checking socket sync');
                if (!newSocket.connected) newSocket.connect();
                setLastOrderEvent({ type: 'RESUME_SYNC', _ts: Date.now() });
            }
        };
        window.addEventListener('visibilitychange', handleVisibilityChange);

        newSocket.on('connect', () => {
            console.log(`⚡ Socket connected! ID: ${newSocket.id}, Role: ${user.role}`);
        });

        newSocket.on('disconnect', (reason) => {
            console.log(`❌ Socket disconnected: ${reason}`);
        });

        newSocket.on('connect_error', (err) => {
            console.error('🔴 Socket connection error:', err.message);
        });

        // Listen for cancellation alerts (Admin/Kitchen only)
        newSocket.on('orderCancelled', (payload) => {
            console.log('🚨 ORDER CANCELLED EVENT RECEIVED:', payload);
            setAlerts(prev => [...prev, { ...payload, id: Date.now() }]);
            playAlertSound();
        });

        // Listen for any order update (for real-time dashboard refresh)
        newSocket.on('orderUpdated', (payload) => {
            console.log('📦 ORDER UPDATED EVENT:', payload);
            setLastOrderEvent({ ...payload, _ts: Date.now() });
        });

        setSocket(newSocket);

        return () => {
            console.log('🔌 Disconnecting socket');
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            newSocket.disconnect();
        };
    }, [isAuthenticated, user?.id]);

    const playAlertSound = useCallback(() => {
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio('/alert.wav');
                audioRef.current.volume = 0.8;
            }
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                console.log('🔇 Audio autoplay blocked — click page to enable');
            });
        } catch (e) {
            console.error('Audio play error:', e);
        }
    }, []);

    const dismissAlert = useCallback((alertId) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    }, []);

    const dismissAllAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, alerts, dismissAlert, dismissAllAlerts, lastOrderEvent }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
}
