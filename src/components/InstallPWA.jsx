import { useState, useEffect } from 'react';

export default function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setSupportsPWA(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt) => {
        evt.preventDefault();
        if (!promptInstall) return;

        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                setSupportsPWA(false);
            }
        });
    };

    if (!supportsPWA) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:bottom-6 sm:w-80">
            <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-2xl shadow-orange-200/50 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                        🍛
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm">Install Food Bliss</p>
                        <p className="text-xs text-gray-500">Access orders faster!</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSupportsPWA(false)}
                        className="text-gray-400 hover:text-gray-600 p-2 text-xs font-semibold"
                    >
                        Later
                    </button>
                    <button
                        onClick={onClick}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
}
