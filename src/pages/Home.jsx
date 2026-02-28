import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuTile from '../components/MenuTile';
import { menuAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* User Info & Actions */}
      {isAuthenticated ? (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-bold text-gray-800">{user?.name} <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-1">{role}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
          <p className="text-gray-700">Please login to place orders</p>
          <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition font-medium">
            Login
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-orange-200/50">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Welcome to Food Bliss
        </h2>
        <p className="text-lg opacity-90">
          Fresh, delicious homemade food delivered to your doorstep
        </p>
      </div>

      {/* Menu Title */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Our Menu
          </h3>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${menu.length} delicious items available`}
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Loading menu...</p>
        </div>
      ) : menu.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl block mb-4">🍽️</span>
          <p className="text-xl font-semibold text-gray-700">No items available right now</p>
          <p className="text-gray-500 mt-2">Check back later for fresh options!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {menu.map((item) => (
            <MenuTile key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 py-6 border-t border-gray-200">
        <p className="text-center text-gray-400 text-sm">
          ✨ Multi-Kitchen System Active — Fresh food from multiple kitchens!
        </p>
      </div>
    </div>
  );
}
