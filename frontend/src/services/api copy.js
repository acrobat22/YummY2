// frontend/src/services/api.js
const API_URL = 'http://localhost:5000/api';

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
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
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