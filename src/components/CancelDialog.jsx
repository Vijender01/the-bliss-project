import { useState } from 'react';

export default function CancelDialog({ order, onClose, onCancel, onRequestCancel }) {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    const withinWindow = elapsed <= 5 * 60 * 1000;
    const remainingMs = Math.max(0, 5 * 60 * 1000 - elapsed);
    const remainingMin = Math.ceil(remainingMs / 60000);

    const handleDirectCancel = async () => {
        setSubmitting(true);
        setError('');
        try {
            await onCancel(order.id);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to cancel');
            setSubmitting(false);
        }
    };

    const handleRequestCancel = async () => {
        if (reason.trim().length < 5) {
            setError('Please provide a reason (min 5 characters)');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await onRequestCancel(order.id, reason.trim());
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request cancellation');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
                {/* Header */}
                <div className="bg-red-600 text-white px-5 py-4">
                    <h3 className="text-lg font-bold">Cancel Order #{order.id}</h3>
                    <p className="text-sm opacity-90">
                        {withinWindow
                            ? `⏱ ${remainingMin} min left for direct cancellation`
                            : '⏰ Direct cancel window expired'
                        }
                    </p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Order summary */}
                    <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Order Total</span>
                            <span className="font-bold text-gray-800">₹{order.totalAmount.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Items</span>
                            <span className="text-gray-700">{order.items.length} items</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {withinWindow ? (
                        <>
                            <p className="text-sm text-gray-600">
                                Your order was placed less than 5 minutes ago. You can cancel it directly.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors text-sm"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleDirectCancel}
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    {submitting ? 'Cancelling...' : '✕ Cancel Order'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600">
                                The 5-minute window has passed. You can request a cancellation with a reason.
                            </p>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Why do you want to cancel? (required)"
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors text-sm"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleRequestCancel}
                                    disabled={submitting || reason.trim().length < 5}
                                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    {submitting ? 'Submitting...' : '📩 Request Cancel'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
