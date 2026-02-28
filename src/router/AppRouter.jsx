import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Cart from '../pages/Cart';
import ItemDetails from '../pages/ItemDetails';
import KitchenDashboard from '../pages/KitchenDashboard';
import OrderHistory from '../pages/OrderHistory';
import OrdersSummary from '../pages/OrdersSummary';
import AdminPanel from '../pages/AdminPanel';
import Profile from '../pages/Profile';
import ManageMenu from '../pages/ManageMenu';
import SystemHealth from '../pages/SystemHealth';
import PaymentPage from '../pages/PaymentPage';
import AlertModal from '../components/AlertModal';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { SocketProvider } from '../context/SocketContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return token && allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
};

const CustomerOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return token && user.role === 'CUSTOMER' ? children : <Navigate to="/" />;
};

export default function AppRouter() {
  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <BrowserRouter>
            <AlertModal />

            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/item/:id" element={<MainLayout><ItemDetails /></MainLayout>} />

              <Route path="/profile" element={
                <CustomerOnlyRoute><MainLayout><Profile /></MainLayout></CustomerOnlyRoute>
              } />

              <Route path="/cart" element={
                <ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>
              } />

              <Route path="/orders" element={
                <ProtectedRoute><MainLayout><OrderHistory /></MainLayout></ProtectedRoute>
              } />

              <Route path="/orders-summary" element={
                <RoleRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}>
                  <MainLayout><OrdersSummary /></MainLayout>
                </RoleRoute>
              } />

              <Route path="/kitchen" element={
                <RoleRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}>
                  <MainLayout><KitchenDashboard /></MainLayout>
                </RoleRoute>
              } />

              <Route path="/admin" element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <MainLayout><AdminPanel /></MainLayout>
                </RoleRoute>
              } />

              <Route path="/manage-menu" element={
                <RoleRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}>
                  <MainLayout><ManageMenu /></MainLayout>
                </RoleRoute>
              } />

              <Route path="/status" element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <MainLayout><SystemHealth /></MainLayout>
                </RoleRoute>
              } />

              <Route path="/payment/:orderId" element={
                <ProtectedRoute><MainLayout><PaymentPage /></MainLayout></ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}
