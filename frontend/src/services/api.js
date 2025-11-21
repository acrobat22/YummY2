// frontend/src/services/api.js
/**
 * URL de base pour les requêtes API.
 * Configurée dans `vite.config.js` pour pointer vers le backend.
 * @constant {string}
 */
const API_URL = '/api';

/**
 * Récupère le token JWT stocké dans le localStorage.
 * @function
 * @returns {string|null} Le token JWT ou `null` s'il n'existe pas.
 */
const getToken = () => localStorage.getItem('token');

/**
 * Configure les headers pour les requêtes API.
 * Ajoute automatiquement le token JWT dans le header `Authorization` si disponible.
 * @function
 * @returns {Object} Objet contenant les headers configurés.
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json' // Type de contenu par défaut pour les requêtes
  };

  const token = getToken();
  if (token) {
    // Ajoute le token JWT au header si disponible
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Fonction générique pour effectuer des requêtes API.
 * Gère les timeouts, les erreurs, et les réponses JSON.
 * @async
 * @function
 * @param {string} endpoint - Point de terminaison de l'API (ex: `/users`).
 * @param {Object} [options={}] - Options pour la requête (méthode, body, headers supplémentaires, etc.).
 * @returns {Promise<Object>} Données retournées par l'API.
 * @throws {Error} En cas d'erreur (timeout, réponse invalide, etc.).
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`; // Construit l'URL complète

  const config = {
    ...options, // Fusionne les options passées en paramètre
    headers: {
      ...getHeaders(), // Ajoute les headers par défaut (incluant le token si disponible)
      ...options.headers // Permet de surcharger les headers par défaut
    }
  };

  // --- Gestion du timeout ---
  // Crée un contrôleur pour annuler la requête après 10 secondes
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Effectue la requête avec le signal d'annulation
    const response = await fetch(url, {
      ...config,
      signal: controller.signal // Passe le signal pour permettre l'annulation
    });

    clearTimeout(timeoutId); // Annule le timeout si la requête réussit

    // --- Gestion des erreurs d'authentification ---
    if (response.status === 401) {
      // Token expiré ou invalide : déconnecte l'utilisateur
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    // --- Vérification du format de la réponse ---
    // Tente de parser la réponse en JSON
    const data = await response.json().catch(() => {
      throw new Error('Invalid JSON response');
    });

    // --- Gestion des erreurs HTTP ---
    if (!response.ok) {
      // Si la réponse n'est pas OK (ex: 404, 500), lève une erreur avec le message de l'API
      throw new Error(data.message || 'Something went wrong');
    }

    return data; // Retourne les données si tout est OK
  } catch (error) {
    clearTimeout(timeoutId); // Annule le timeout en cas d'erreur

    // --- Gestion des erreurs spécifiques ---
    if (error.name === 'AbortError') {
      // Si la requête a été annulée par le timeout
      throw new Error('Request timeout');
    }

    // Propage l'erreur pour qu'elle soit gérée par l'appelant
    throw error;
  }
};

/**
 * API pour la gestion de l'authentification (inscription, connexion, profil).
 * @namespace authAPI
 */
export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur.
   * @async
   * @function
   * @param {Object} userData - Données de l'utilisateur (email, password, etc.).
   * @returns {Promise<Object>} Réponse de l'API.
   */
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData) // Convertit les données en JSON
  }),

  /**
   * Connexion d'un utilisateur.
   * @async
   * @function
   * @param {Object} credentials - Identifiants de connexion (email, password).
   * @returns {Promise<Object>} Réponse de l'API (inclut le token JWT).
   */
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  /**
   * Récupère le profil de l'utilisateur connecté.
   * @async
   * @function
   * @returns {Promise<Object>} Données du profil utilisateur.
   */
  getProfile: () => fetchAPI('/auth/profile')
};

/**
 * API pour la gestion des catégories (CRUD).
 * @namespace categoriesAPI
 */
export const categoriesAPI = {
  /**
   * Récupère toutes les catégories.
   * @async
   * @function
   * @returns {Promise<Object>} Liste des catégories.
   */
  getAll: () => fetchAPI('/categories'),

  /**
   * Récupère une catégorie par son ID.
   * @async
   * @function
   * @param {string} id - ID de la catégorie.
   * @returns {Promise<Object>} Données de la catégorie.
   */
  getById: (id) => fetchAPI(`/categories/${id}`),

  /**
   * Crée une nouvelle catégorie.
   * @async
   * @function
   * @param {Object} categoryData - Données de la catégorie (name, description, etc.).
   * @returns {Promise<Object>} Catégorie créée.
   */
  create: (categoryData) => fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  }),

  /**
   * Met à jour une catégorie existante.
   * @async
   * @function
   * @param {string} id - ID de la catégorie à mettre à jour.
   * @param {Object} categoryData - Nouvelles données de la catégorie.
   * @returns {Promise<Object>} Catégorie mise à jour.
   */
  update: (id, categoryData) => fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  }),

  /**
   * Supprime une catégorie.
   * @async
   * @function
   * @param {string} id - ID de la catégorie à supprimer.
   * @returns {Promise<Object>} Résultat de la suppression.
   */
  delete: (id) => fetchAPI(`/categories/${id}`, {
    method: 'DELETE'
  })
};

/**
 * API pour la gestion des articles (CRUD).
 * @namespace itemsAPI
 */
export const itemsAPI = {
  /**
   * Récupère tous les articles, éventuellement filtrés par catégorie.
   * @async
   * @function
   * @param {string|null} [categoryId=null] - ID de la catégorie pour filtrer les articles.
   * @returns {Promise<Object>} Liste des articles.
   */
  getAll: (categoryId = null) => {
    const query = categoryId ? `?categoryId=${categoryId}` : ''; // Construit la query string si nécessaire
    return fetchAPI(`/items${query}`);
  },

  /**
   * Récupère un article par son ID.
   * @async
   * @function
   * @param {string} id - ID de l'article.
   * @returns {Promise<Object>} Données de l'article.
   */
  getById: (id) => fetchAPI(`/items/${id}`),

  /**
   * Crée un nouvel article.
   * @async
   * @function
   * @param {Object} itemData - Données de l'article (name, description, price, categoryId, etc.).
   * @returns {Promise<Object>} Article créé.
   */
  create: (itemData) => fetchAPI('/items', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),

  /**
   * Met à jour un article existant.
   * @async
   * @function
   * @param {string} id - ID de l'article à mettre à jour.
   * @param {Object} itemData - Nouvelles données de l'article.
   * @returns {Promise<Object>} Article mis à jour.
   */
  update: (id, itemData) => fetchAPI(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),

  /**
   * Supprime un article.
   * @async
   * @function
   * @param {string} id - ID de l'article à supprimer.
   * @returns {Promise<Object>} Résultat de la suppression.
   */
  delete: (id) => fetchAPI(`/items/${id}`, {
    method: 'DELETE'
  })
};
