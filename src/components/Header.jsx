import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    openDrawer();
  };

  const navLinks = {
    CUSTOMER: [
      { label: 'Profile', path: '/profile' },
      { label: 'Orders', path: '/orders' },
    ],
    KITCHEN_OWNER: [
      { label: 'Kitchen', path: '/kitchen' },
      { label: 'Summary', path: '/orders-summary' },
      { label: 'Manage Menu', path: '/manage-menu' },
    ],
    ADMIN: [
      { label: 'Admin', path: '/admin' },
      { label: 'Kitchen', path: '/kitchen' },
      { label: 'Summary', path: '/orders-summary' },
      { label: 'Manage Menu', path: '/manage-menu' },
      { label: 'Status', path: '/status' },
    ],
  };

  const userNavLinks = role && navLinks[role] ? navLinks[role] : [];

  return (
    <header className="sticky top-0 z-30 w-full bg-orange-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
            <span className="text-2xl">🍛</span>
            <h1 className="text-xl sm:text-2xl font-bold">Food Bliss</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm font-semibold text-orange-100">Order Fresh & Tasty Food</div>

            {isAuthenticated && (
              <nav className="flex items-center gap-1">
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Cart Button with Badge */}
                {role === 'CUSTOMER' && (
                  <button
                    onClick={handleCartClick}
                    className="relative text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-once shadow-md">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </nav>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart Button */}
            {isAuthenticated && role === 'CUSTOMER' && (
              <button
                onClick={handleCartClick}
                className="relative p-2 hover:bg-orange-600 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white text-2xl p-1"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-orange-400/50 pt-3">
            {isAuthenticated && (
              <nav className="flex flex-col gap-1">
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium hover:bg-orange-600 px-3 py-2.5 rounded-lg transition-colors block"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-orange-600 px-3 py-2.5 rounded-lg transition-colors text-left"
                >
                  Logout
                </button>
              </nav>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium hover:bg-orange-600 px-3 py-2.5 rounded-lg transition-colors block"
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
