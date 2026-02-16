import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This is a placeholder - you'll need to create user management endpoints
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // TODO: Implement user fetch from backend
    console.log('Loading users...');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // TODO: Call backend API to create user
      setMessage('✓ User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'CUSTOMER' });
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to create user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      // TODO: Call backend API to update user role
      setMessage('✓ User role updated');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to update role');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Admin Panel</h1>

      {message && (
        <div className={`p-4 rounded mb-6 ${message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold ${activeTab === 'users' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-semibold ${activeTab === 'create' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}
        >
          Create User
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-3 text-sm text-gray-800">{user.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="KITCHEN_OWNER">Kitchen Owner</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 text-sm text-blue-600 hover:underline cursor-pointer">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <div className="p-6 text-center text-gray-600">No users found</div>}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="KITCHEN_OWNER">Kitchen Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Create User
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
