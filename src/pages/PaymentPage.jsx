import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

export default function PaymentPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const UPI_ID = '7973503447@ptsbi';
    const WHATSAPP_NUMBER = '919781503580';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getById(orderId);
                setOrder(response.data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePaymentDone = async () => {
        try {
            await orderAPI.markPaymentDone(orderId);

            const message = `Hello Food Bliss,
I have completed payment for Order #${order.id}.
Amount Paid: ₹${order.totalAmount}
UPI ID: ${UPI_ID}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            // ✅ PWA-Safe External Navigation
            // Using window.location.assign is often more reliable inside installed PWAs
            // as it signals a navigation away from the controlled scope.
            window.location.assign(whatsappUrl);
        } catch (err) {
            console.error('Error updating payment status:', err);
            alert('Failed to update payment status. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-orange-500 p-8 text-center text-white">
                        <h1 className="text-3xl font-black mb-2 tracking-tight">Complete Your Payment</h1>
                        <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                            Secured Checkout
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Order Details */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Order ID</p>
                                <p className="text-lg font-black text-gray-800">#{order.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Amount</p>
                                <p className="text-3xl font-black text-gray-800">₹{order.totalAmount}</p>
                            </div>
                        </div>

                        {/* UPI Info */}
                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <p className="text-sm font-bold text-gray-500 mb-4 tracking-wide">SCAN QR TO PAY</p>
                                <div className="p-4 bg-white border-2 border-orange-100 rounded-3xl shadow-inner mb-4">
                                    <img
                                        src="/upi-qr.png"
                                        alt="UPI QR Code"
                                        className="w-64 h-auto rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest ml-1">UPI ID</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-50 border-2 border-transparent group-hover:border-orange-100 p-4 rounded-2xl font-mono text-gray-700 transition-all font-bold">
                                        {UPI_ID}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-4 rounded-2xl transition-all font-bold ${copied ? 'bg-green-500 text-white shadow-green-200 shadow-lg' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                                    >
                                        {copied ? '✓' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <button
                                onClick={handlePaymentDone}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-200 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <span>I Have Completed Payment</span>
                                <span className="bg-white/20 p-1 rounded-full">➜</span>
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 px-4 leading-relaxed">
                                After clicking, you will be redirected to WhatsApp to share the confirmation.
                                Our team will verify and start preparing your order!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
