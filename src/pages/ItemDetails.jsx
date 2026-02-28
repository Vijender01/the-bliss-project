import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await menuAPI.getById(id);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    const success = await addToCart(item, quantity);
    setAdding(false);
    if (success) {
      setAdded(true);
      setQuantity(1);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="text-center py-20"><div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>;
  if (!item) return <div className="text-center py-20 text-gray-500">Item not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="h-48 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 flex items-center justify-center text-7xl relative">
          {item.image?.startsWith('http') ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="drop-shadow-lg">{item.image || '🍽️'}</span>
          )}

          {item.isLimited && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 shadow-md">
              ⚠️ Limited Quantity Left
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{item.name}</h1>
          <p className="text-gray-500 mb-1">{item.description}</p>
          {item.kitchen && (
            <p className="text-xs text-gray-400 mb-4">from {item.kitchen.name}</p>
          )}

          <div className="border-t border-b border-gray-100 py-4 mb-6">
            <div className="text-3xl font-extrabold text-orange-600">₹{item.price}</div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold text-gray-700">Quantity:</label>
            <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || item.isOutOfStock}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${added
                ? 'bg-green-500 text-white'
                : item.isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98] shadow-lg shadow-orange-200'
              }`}
          >
            {adding ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : added ? (
              '✓ Added to Cart!'
            ) : item.isOutOfStock ? (
              'Out of Stock'
            ) : (
              `🛒 Add to Cart — ₹${(item.price * quantity).toFixed(0)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
