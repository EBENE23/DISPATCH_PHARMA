import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyCode: (tempToken, code) => api.post('/auth/verify-code', { tempToken, code }),
  resendCode: (tempToken) => api.post('/auth/resend-code', { tempToken }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Services produits
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

// Services commandes
export const orderService = {
  getAll: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
};

// Services panier
export const cartService = {
  getCart: (doctorId) => api.get('/cart', { params: { doctorId } }),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  clearCart: (doctorId) => api.delete('/cart/clear', { data: { doctorId } }),
};

// Services médecins
export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
};

// Services messages
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  sendMessage: (receiverId, message) => api.post('/messages/send', { receiverId, message }),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

// Services IA
export const aiService = {
  predict: (doctorId) => api.get(`/ai/predict/${doctorId}`),
  recommend: (doctorId) => api.get(`/ai/recommend/${doctorId}`),
  getInsights: () => api.get('/ai/insights'),
  getTrends: () => api.get('/ai/trends'),
};

export default api;