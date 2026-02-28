import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideDrawer = location.pathname === '/cart';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
      {!hideDrawer && <CartDrawer />}
    </div>
  );
}
