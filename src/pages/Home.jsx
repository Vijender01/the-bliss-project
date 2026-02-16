import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import { menuAPI } from '../services/api';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenu(response.data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* User Info & Actions */}
      {user && user.id ? (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="font-semibold text-gray-800">{user.name} ({user.role})</p>
          </div>
          <div className="space-x-2 flex">
            <Link
              to="/cart"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
            >
              🛒 Cart
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <p className="text-gray-700">Please login to place orders</p>
          <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition">
            Login
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Welcome to Food Bliss
        </h2>
        <p className="text-lg opacity-90">
          Fresh, delicious homemade food delivered to your doorstep
        </p>
      </div>

      {/* Menu Title */}
      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Our Menu
        </h3>
        <p className="text-gray-600 mt-1">
          {loading ? 'Loading...' : menu.length} delicious items available
        </p>
      </div>

      {/* Menu Grid - Responsive Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading menu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 py-6 border-t border-gray-300">
        <p className="text-center text-gray-600 text-sm">
          ✨ Phase 2 Complete: Full ordering system, cart management, and kitchen dashboard!
        </p>
      </div>
    </div>
  );
}
