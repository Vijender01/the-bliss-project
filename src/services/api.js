import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Menu API
export const menuAPI = {
  getAll: () => api.get('/menu'),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
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
  place: () => api.post('/orders'),
  getMyOrders: () => api.get('/orders'),
  getAll: () => api.get('/orders/all'),
  updateStatus: (orderId, data) => api.put(`/orders/${orderId}/status`, data),
};

export default api;
