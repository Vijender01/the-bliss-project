import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function OrdersSummary() {
    const calculateDefaultDate = () => {
        const now = new Date();
        const hour = now.getHours();
        const d = new Date(now);

        // Match backend logic: orders after 3 PM (15:00) 
        // OR before 11 AM belong to tomorrow/today delivery.
        // For the summary dashboard, if it's after 3 PM, show tomorrow's orders by default.
        if (hour >= 15) {
            d.setDate(d.getDate() + 1);
        }
        return d.toISOString().split('T')[0];
    };

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(calculateDefaultDate());
    const { lastOrderEvent } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        fetchSummary();
    }, [date]);

    // Real-time refresh when order events come in
    useEffect(() => {
        if (lastOrderEvent) {
            console.log('📊 Refreshing summary due to order event');
            fetchSummary();
        }
    }, [lastOrderEvent]);

    const fetchSummary = async () => {
        try {
            const res = await orderAPI.getSummary(date);
            setSummary(res.data);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (orderId) => {
        try {
            await orderAPI.confirmPayment(orderId);
            fetchSummary();
        } catch (error) {
            alert('Failed to confirm payment');
        }
    };

    if (loading) return (
        <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">📊 Consolidated Orders</h1>
                    <p className="text-orange-600 font-bold mt-1 uppercase tracking-wider text-sm">
                        Delivery Date: {summary ? new Date(summary.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : date}
                    </p>
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setLoading(true); }}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white font-medium"
                />
            </div>

            {summary && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
                            <p className="text-xs text-blue-600 font-semibold uppercase">Total Orders</p>
                            <p className="text-3xl font-extrabold text-blue-800 mt-1">{summary.totalOrders}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl border border-orange-200">
                            <p className="text-xs text-orange-600 font-semibold uppercase">Total Items</p>
                            <p className="text-3xl font-extrabold text-orange-800 mt-1">{summary.totalItems}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
                            <p className="text-xs text-green-600 font-semibold uppercase">Revenue</p>
                            <p className="text-3xl font-extrabold text-green-800 mt-1">₹{summary.totalRevenue?.toFixed(0)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-2xl border border-red-200">
                            <p className="text-xs text-red-600 font-semibold uppercase">Cancelled</p>
                            <p className="text-3xl font-extrabold text-red-800 mt-1">{summary.cancelledOrders}</p>
                        </div>
                    </div>

                    {/* Item Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 text-lg">🍽️ Items Ordered (Aggregated)</h2>
                        </div>
                        {summary.items.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">No orders for this date</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {summary.items.map((item) => (
                                    <div key={item.menuItemId} className="px-5 py-4 flex items-center justify-between hover:bg-orange-50/30 transition">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.image?.startsWith('http') ? '' : (item.image || '🍽️')}</span>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {item.category === 'BREAKFAST' ? '🌅 Breakfast' : '☀️ Lunch'} • ₹{item.price} each
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-orange-600">{item.totalQuantity}</p>
                                            <p className="text-xs text-gray-400">₹{item.totalRevenue.toFixed(0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Individual Orders */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 text-lg">📋 All Orders</h2>
                        </div>
                        {summary.orders.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">No orders for this date</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {summary.orders.map((order) => (
                                    <div key={order.id} className={`px-5 py-4 ${order.status === 'CANCELLED' ? 'opacity-50 bg-red-50/30' : ''}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-extrabold text-orange-600">#{order.id}</span>
                                                <span className="font-semibold text-gray-700">{order.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">₹{order.totalAmount.toFixed(0)}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${order.paymentStatus === 'CONFIRMED' ? 'bg-green-500 text-white' :
                                                    order.paymentStatus === 'PAYMENT_DONE' ? 'bg-blue-500 text-white' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.paymentStatus.replace(/_/g, ' ')}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                {order.items.map((i, idx) => (
                                                    <span key={idx}>{idx > 0 && ' • '}{i.name} ×{i.qty}</span>
                                                ))}
                                            </div>
                                            {user?.role === 'ADMIN' && order.paymentStatus !== 'CONFIRMED' && (
                                                <button
                                                    onClick={() => handleConfirmPayment(order.id)}
                                                    className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                                                >
                                                    Confirm Payment
                                                </button>
                                            )}
                                        </div>
                                        {order.specialInstructions && (
                                            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                                                <p className="text-xs text-yellow-700 font-semibold">📝 {order.specialInstructions}</p>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
