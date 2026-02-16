import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // API integration will be added later
    console.log('Change password:', formData);
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-4xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'User'}</h1>
              <p className="text-gray-600 mt-2">Customer Account</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4 mb-8">
            <div className="border-b pb-4">
              <label className="text-sm font-semibold text-gray-600">Full Name</label>
              <p className="text-lg text-gray-800 mt-1">{user?.name || 'N/A'}</p>
            </div>
            <div className="border-b pb-4">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <p className="text-lg text-gray-800 mt-1">{user?.email || 'N/A'}</p>
            </div>
            <div className="border-b pb-4">
              <label className="text-sm font-semibold text-gray-600">Account Type</label>
              <p className="text-lg text-gray-800 mt-1 capitalize">{user?.role?.toLowerCase() || 'N/A'}</p>
            </div>
          </div>

          {/* Change Password Button */}
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {/* Change Password Form */}
        {showChangePassword && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
