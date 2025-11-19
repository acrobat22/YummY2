// frontend/src/services/api.js
//const API_URL = 'http://localhost:4000/api';
const API_URL = '/api'; // url backen configuré dans vite.config.js

// Récupérer le token du localStorage
const getToken = () => localStorage.getItem('token');

// Configuration des headers
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Fonction générique pour les requêtes
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  };

  // Timeout de 10 secondes
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // Gestion du token expiré
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    // Vérification du contenu JSON
    const data = await response.json().catch(() => {
      throw new Error('Invalid JSON response');
    });

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getProfile: () => fetchAPI('/auth/profile')
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetchAPI('/categories'),

  getById: (id) => fetchAPI(`/categories/${id}`),

  create: (categoryData) => fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  }),

  update: (id, categoryData) => fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  }),

  delete: (id) => fetchAPI(`/categories/${id}`, {
    method: 'DELETE'
  })
};

// Items API
export const itemsAPI = {
  getAll: (categoryId = null) => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return fetchAPI(`/items${query}`);
  },

  getById: (id) => fetchAPI(`/items/${id}`),

  create: (itemData) => fetchAPI('/items', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),

  update: (id, itemData) => fetchAPI(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),

  delete: (id) => fetchAPI(`/items/${id}`, {
    method: 'DELETE'
  })
};
