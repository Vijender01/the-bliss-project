import { useEffect } from 'react';

export default function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
        primary: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
    };

    const btnClass = variantStyles[variant] || variantStyles.primary;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-red-50 mb-4">
                    <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {title || 'Are you sure?'}
                </h3>

                <p className="text-gray-600 text-center mb-6">
                    {message || 'This action cannot be undone.'}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        {cancelLabel || 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 ${btnClass}`}
                    >
                        {confirmLabel || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
