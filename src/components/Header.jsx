import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = {
    CUSTOMER: [
      { label: 'Profile', path: '/profile' },
      { label: 'Orders', path: '/orders' },
      { label: 'Cart', path: '/cart' },
    ],
    KITCHEN_OWNER: [
      { label: 'Kitchen', path: '/kitchen' },
      { label: 'Manage Menu', path: '/manage-menu' },
    ],
    ADMIN: [
      { label: 'Admin', path: '/admin' },
      { label: 'Kitchen', path: '/kitchen' },
      { label: 'Manage Menu', path: '/manage-menu' },
    ],
  };

  const userNavLinks = role && navLinks[role] ? navLinks[role] : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-orange-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
            <span className="text-2xl">🍛</span>
            <h1 className="text-2xl font-bold">Food Bliss</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="text-sm font-semibold">Order Fresh & Tasty Food</div>

            {isAuthenticated && (
              <nav className="flex items-center gap-6">
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </nav>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-sm font-medium hover:bg-orange-600 px-4 py-2 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-orange-600">
            <div className="text-xs font-semibold mb-4 text-orange-100">Order Fresh & Tasty Food</div>

            {isAuthenticated && (
              <nav className="flex flex-col gap-2">
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded transition-colors block"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded transition-colors text-left"
                >
                  Logout
                </button>
              </nav>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded transition-colors block"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
