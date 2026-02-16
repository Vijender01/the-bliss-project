import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Cart from '../pages/Cart';
import ItemDetails from '../pages/ItemDetails';
import KitchenDashboard from '../pages/KitchenDashboard';
import OrderHistory from '../pages/OrderHistory';
import AdminPanel from '../pages/AdminPanel';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return token && allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/item/:id"
          element={
            <MainLayout>
              <ItemDetails />
            </MainLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Cart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderHistory />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/kitchen"
          element={
            <RoleRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}>
              <MainLayout>
                <KitchenDashboard />
              </MainLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <MainLayout>
                <AdminPanel />
              </MainLayout>
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
