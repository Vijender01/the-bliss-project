import { useState, useEffect } from 'react';

export default function LimitedQuantityDialog({ isOpen, item, onSave, onClose }) {
    const [isLimited, setIsLimited] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setIsLimited(item.isLimited || false);
            setQuantity(item.limitedQuantity?.toString() || '');
        }
    }, [item, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                isLimited,
                limitedQuantity: isLimited ? parseInt(quantity) || null : null,
            });
            onClose();
        } catch (err) {
            console.error('Save limited quantity failed:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Limited Quantity</h2>
                        {item && <p className="text-sm text-gray-500">{item.name}</p>}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-semibold text-gray-800">Enable Limited Warning</p>
                            <p className="text-sm text-gray-500">Shows a warning badge to customers</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLimited(!isLimited)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isLimited ? 'bg-yellow-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${isLimited ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Quantity Input */}
                    {isLimited && (
                        <div className="animate-in">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Remaining Quantity
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="e.g. 10"
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all text-gray-800"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
