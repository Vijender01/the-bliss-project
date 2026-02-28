import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import CancelDialog from '../components/CancelDialog';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    await orderAPI.cancel(orderId);
    setMessage('✓ Order cancelled successfully');
    setTimeout(() => setMessage(''), 3000);
    fetchOrders();
  };

  const handleRequestCancel = async (orderId, reason) => {
    await orderAPI.requestCancel(orderId, { reason });
    setMessage('✓ Cancellation request submitted');
    setTimeout(() => setMessage(''), 3000);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    const colors = {
      PLACED: 'bg-blue-100 text-blue-800',
      STARTED_PREPARING: 'bg-yellow-100 text-yellow-800',
      PREPARED: 'bg-green-100 text-green-800',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancel = (order) => {
    return (
      order.status !== 'DELIVERED' &&
      order.status !== 'CANCELLED' &&
      !order.cancellationRequested
    );
  };

  const isWithinWindow = (order) => {
    return Date.now() - new Date(order.createdAt).getTime() <= 5 * 60 * 1000;
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">📦 My Orders</h1>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl block mb-4">📦</span>
          <p className="text-xl font-semibold text-gray-700">No orders yet</p>
          <p className="text-gray-500 mt-2">Place your first order from the menu!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-5 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Order ID</p>
                    <p className="text-lg font-extrabold text-orange-600">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Date</p>
                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Total</p>
                    <p className="text-lg font-extrabold text-gray-800">₹{order.totalAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">Status</p>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-3">
                  <div className="space-y-1.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.menuItem?.image && !item.menuItem.image.startsWith('http') && <span className="mr-1">{item.menuItem.image}</span>}
                          {item.menuItem.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancellation Requested Badge */}
                {order.cancellationRequested && order.status !== 'CANCELLED' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
                    <p className="text-orange-700 font-bold text-sm">📩 Cancellation Requested</p>
                    {order.cancellationReason && (
                      <p className="text-orange-600 text-xs mt-1">Reason: {order.cancellationReason}</p>
                    )}
                  </div>
                )}

                {/* Cancelled Info */}
                {order.status === 'CANCELLED' && order.cancelledAt && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                    <p className="text-red-700 font-bold text-sm">✕ Cancelled</p>
                    <p className="text-red-500 text-xs mt-1">
                      at {new Date(order.cancelledAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Cancel Button */}
              {canCancel(order) && (
                <div className="px-5 pb-4">
                  <button
                    onClick={() => setCancelOrder(order)}
                    className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${isWithinWindow(order)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                  >
                    {isWithinWindow(order) ? '✕ Cancel Order' : '📩 Request Cancellation'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      {cancelOrder && (
        <CancelDialog
          order={cancelOrder}
          onClose={() => setCancelOrder(null)}
          onCancel={handleCancel}
          onRequestCancel={handleRequestCancel}
        />
      )}
    </div>
  );
}
