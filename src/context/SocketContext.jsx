import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { isAuthenticated, role } = useAuth();
    const [socket, setSocket] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        // Derive socket URL from API URL
        let socketUrl;
        if (API_URL.startsWith('/')) {
            // Relative URL — connect to same origin
            socketUrl = window.location.origin;
        } else {
            // Absolute URL like http://localhost:5000/api
            socketUrl = API_URL.replace(/\/api\/?$/, '');
        }

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
        });

        newSocket.on('connect', () => {
            console.log('⚡ Socket connected');
        });

        newSocket.on('orderCancelled', (payload) => {
            console.log('🚨 Order cancellation event:', payload);
            setAlerts(prev => [...prev, { ...payload, id: Date.now() }]);
            playAlertSound();
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated]);

    const playAlertSound = () => {
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio('/alert.wav');
                audioRef.current.volume = 0.8;
            }
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Browser may block autoplay until user interaction
                console.log('Audio autoplay blocked — user interaction required');
            });
        } catch (e) {
            console.error('Audio play error:', e);
        }
    };

    const dismissAlert = (alertId) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    };

    const dismissAllAlerts = () => {
        setAlerts([]);
    };

    return (
        <SocketContext.Provider value={{ socket, alerts, dismissAlert, dismissAllAlerts }}>
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
