import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuAPI, cartAPI } from '../services/api';

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

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
    try {
      await cartAPI.add({ menuItemId: parseInt(id), quantity });
      setMessage('✓ Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to add to cart');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!item) return <div className="text-center py-20">Item not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl text-center mb-6">{item.image || '🍽️'}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>

        <div className="border-t border-b py-4 mb-6">
          <div className="text-3xl font-bold text-orange-600">₹{item.price}</div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="font-semibold">Quantity:</label>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100"
            >
              −
            </button>
            <span className="px-6 py-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {message && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{message}</div>}

        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Add to Cart - ₹{item.price * quantity}
        </button>
      </div>
    </div>
  );
}
