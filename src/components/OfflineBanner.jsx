import { useState, useEffect } from 'react';

export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (wasOffline) {
                // Force refresh data/page when coming back online
                window.location.reload();
            }
        };
        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [wasOffline]);

    if (isOnline) {
        if (wasOffline) {
            return (
                <div className="fixed top-0 left-0 w-full bg-green-500 text-white py-2 text-center text-sm font-bold z-[9999] animate-bounce">
                    📡 Connection Restored! Refreshing...
                </div>
            );
        }
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white py-3 px-4 text-center z-[9999] shadow-lg flex items-center justify-center gap-3">
            <span className="animate-pulse">⚠️</span>
            <span className="font-bold underline tracking-wide">Internet Connection Lost</span>
            <span className="text-xs opacity-80">(Switching to Offline Mode)</span>
        </div>
    );
}
