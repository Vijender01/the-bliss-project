import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import QuantitySelector from '../components/QuantitySelector';

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart, fetchCart } = useCart();
  const [message, setMessage] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await orderAPI.place();
      setMessage('✓ Order placed successfully!');
      await clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      setMessage('Failed to place order');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">🛒 Your Cart</h1>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl block mb-4">🛒</span>
          <p className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some delicious items from our menu!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition shadow-md"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {items.map((ci) => (
              <div key={ci.menuItemId} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                {/* Image */}
                <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex items-center justify-center text-3xl">
                  {ci.menuItem.image?.startsWith('http') ? (
                    <img src={ci.menuItem.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    ci.menuItem.image || '🍽️'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800">{ci.menuItem.name}</h3>
                  <p className="text-orange-600 font-bold">₹{ci.menuItem.price}</p>
                </div>

                {/* Quantity */}
                <QuantitySelector
                  value={ci.quantity}
                  onChange={(q) => updateQuantity(ci.menuItemId, q)}
                  min={0}
                  size="md"
                />

                {/* Subtotal + Remove */}
                <div className="text-right min-w-[70px] flex-shrink-0">
                  <p className="font-bold text-gray-800 text-lg">₹{(ci.menuItem.price * ci.quantity).toFixed(0)}</p>
                  <button
                    onClick={() => removeItem(ci.menuItemId)}
                    className="text-red-500 text-xs hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-extrabold text-orange-600">₹{total.toFixed(0)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-lg"
            >
              {placing ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
