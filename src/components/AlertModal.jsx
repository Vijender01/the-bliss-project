import { useSocket } from '../context/SocketContext';

export default function AlertModal() {
    const { alerts, dismissAlert } = useSocket();

    if (alerts.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Alert Stack */}
            <div className="relative z-10 w-full max-w-md space-y-4 max-h-[80vh] overflow-y-auto">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in border-2 border-red-500"
                    >
                        {/* Red Header */}
                        <div className={`px-5 py-4 ${alert.type === 'CANCELLED' ? 'bg-red-600' : 'bg-orange-500'} text-white`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🚨</span>
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {alert.type === 'CANCELLED' ? 'Order Cancelled!' : 'Cancellation Requested'}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => dismissAlert(alert.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Order ID */}
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm font-medium">Order ID</span>
                                <span className="text-lg font-extrabold text-red-600">#{alert.orderId}</span>
                            </div>

                            {/* Customer */}
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                <span className="text-gray-500 text-sm font-medium">Customer</span>
                                <span className="font-bold text-gray-800">{alert.customerName}</span>
                            </div>

                            {/* Items */}
                            <div className="mb-3 pb-3 border-b border-gray-100">
                                <p className="text-gray-500 text-sm font-medium mb-2">Items</p>
                                <div className="space-y-1">
                                    {alert.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.name} × {item.qty}</span>
                                            <span className="font-medium">₹{(item.price * item.qty).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-500 text-sm font-medium">Total</span>
                                <span className="text-xl font-extrabold text-gray-800">₹{alert.totalAmount?.toFixed(0)}</span>
                            </div>

                            {/* Reason (for requests) */}
                            {alert.reason && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
                                    <p className="text-xs text-orange-600 font-semibold mb-1">Reason</p>
                                    <p className="text-sm text-gray-700">{alert.reason}</p>
                                </div>
                            )}

                            {/* Close button */}
                            <button
                                onClick={() => dismissAlert(alert.id)}
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors text-sm"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
