import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuTile from '../components/MenuTile';
import { menuAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [deliveryConfig, setDeliveryConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, configRes] = await Promise.all([
        menuAPI.getAll(),
        orderAPI.getDeliveryConfig()
      ]);
      setMenu(menuRes.data);
      setDeliveryConfig(configRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const breakfastItems = menu.filter(item => item.category === 'BREAKFAST');
  const lunchItems = menu.filter(item => item.category === 'LUNCH');

  const MenuSection = ({ title, emoji, timeNote, items }) => (
    <div className="mb-10">
      <div className="mb-5">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h3>
        <p className="text-sm text-orange-600 font-semibold mt-1 flex items-center gap-1">
          🕐 {timeNote}
        </p>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No {title.toLowerCase()} items available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <MenuTile key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* User Info & Actions */}
      {isAuthenticated ? (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-bold text-gray-800">{user?.name} <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-1">{role}</span></p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium">Logout</button>
        </div>
      ) : (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
          <p className="text-gray-700">Please login to place orders</p>
          <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition font-medium">Login</Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-orange-200/50">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">Welcome to Food Bliss</h2>
        <p className="text-lg opacity-90 text-white">Fresh, delicious homemade food delivered to your doorstep</p>

        {deliveryConfig && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/30">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">Ordering for</p>
                <p className="font-bold text-lg text-white leading-tight">{deliveryConfig.displayDate}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-white/20">
              <span className="text-2xl">🕒</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">Order Window</p>
                <p className="text-sm font-medium text-white">{deliveryConfig.windowMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivery & Kitchen Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Delivery Location</p>
            <p className="font-bold text-gray-800 mt-0.5">Sector 67, Sebiz Square, Mohali</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
          <span className="text-2xl">🏪</span>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Operating Kitchen</p>
            <p className="font-bold text-gray-800 mt-0.5">Food Bliss</p>
          </div>
        </div>
      </div>

      {/* Menu */}
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
        <>
          <MenuSection
            title="Breakfast"
            emoji="🌅"
            timeNote="Delivery: 9:00 AM – 10:00 AM"
            items={breakfastItems}
          />
          <MenuSection
            title="Lunch"
            emoji="☀️"
            timeNote="Delivery: 12:30 PM – 1:30 PM"
            items={lunchItems}
          />
        </>
      )}

      {/* Footer */}
      <div className="mt-12 py-6 border-t border-gray-200">
        <p className="text-center text-gray-400 text-sm">
          ✨ Fresh food from Food Bliss kitchen — made with love!
        </p>
      </div>
    </div>
  );
}
