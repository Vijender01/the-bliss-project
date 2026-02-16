import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (menuItemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await cartAPI.remove(menuItemId);
      } else {
        await cartAPI.update(menuItemId, { quantity: newQuantity });
      }
      fetchCart();
    } catch (error) {
      setMessage('Failed to update cart');
    }
  };

  const handleRemoveItem = async (menuItemId) => {
    try {
      await cartAPI.remove(menuItemId);
      fetchCart();
    } catch (error) {
      setMessage('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await orderAPI.place();
      setMessage('✓ Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      setMessage('Failed to place order');
    }
  };

  if (loading) return <div className="text-center py-20">Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Cart</h1>

      {message && (
        <div className={`p-4 rounded mb-6 ${message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {cart.items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.items.map((item) => (
              <div key={item.menuItemId} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.menuItem.name}</h3>
                  <p className="text-orange-600 font-semibold">₹{item.menuItem.price}</p>
                </div>

                <div className="flex items-center gap-2 mx-4">
                  <button
                    onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-24">
                  <p className="font-semibold text-gray-800">₹{(item.menuItem.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.menuItemId)}
                    className="text-red-600 text-sm hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-800">Total:</span>
              <span className="text-3xl font-bold text-orange-600">₹{cart.total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
