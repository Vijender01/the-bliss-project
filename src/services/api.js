import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Menu API (public)
export const menuAPI = {
  getAll: () => api.get('/menu'),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
};

// Kitchen Menu API (protected)
export const kitchenMenuAPI = {
  getMenu: (kitchenId) => api.get('/kitchen/menu', { params: kitchenId ? { kitchenId } : {} }),
  addItem: (data) => api.post('/kitchen/menu', data),
  updateItem: (id, data) => api.put(`/kitchen/menu/${id}`, data),
  deleteItem: (id) => api.delete(`/kitchen/menu/${id}`),
  toggleOutOfStock: (id, isOutOfStock) => api.patch(`/kitchen/menu/${id}/out-of-stock`, { isOutOfStock }),
  setLimited: (id, data) => api.patch(`/kitchen/menu/${id}/limited`, data),
  listKitchens: () => api.get('/kitchen/list'),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (menuItemId, data) => api.put(`/cart/${menuItemId}`, data),
  remove: (menuItemId) => api.delete(`/cart/${menuItemId}`),
  clear: () => api.delete('/cart'),
};

// Order API
export const orderAPI = {
  place: (data) => api.post('/orders', data || {}),
  getMyOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders/all'),
  getSummary: (date) => api.get('/orders/summary', { params: date ? { date } : {} }),
  getDeliveryConfig: () => api.get('/orders/delivery-config'),
  updateStatus: (orderId, data) => api.put(`/orders/${orderId}/status`, data),
  markPaymentDone: (id) => api.patch(`/orders/${id}/payment-done`),
  confirmPayment: (id) => api.put(`/orders/${id}/confirm-payment`),
  cancel: (orderId) => api.post(`/orders/${orderId}/cancel`),
  requestCancel: (orderId, data) => api.post(`/orders/${orderId}/request-cancel`, data),
};

export default api;
