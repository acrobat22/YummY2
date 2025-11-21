// frontend/src/contexts/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider
 * 
 * Fournit un contexte d'authentification à toute l'application.
 * - Gère l'état de l'utilisateur connecté.
 * - Stocke et supprime le token JWT dans localStorage.
 * - Expose des fonctions pour login, register et logout.
 * - Charge automatiquement le profil utilisateur si un token est présent.
 * 
 * @param {ReactNode} children - Les composants enfants qui auront accès au contexte.
 */
export const AuthProvider = ({ children }) => {
  /**
   * État utilisateur
   * - Contient les informations de l'utilisateur connecté (ou null si non connecté).
   */
  const [user, setUser] = useState(null);

  /**
   * État de chargement
   * - Indique si les données d'authentification sont en cours de récupération.
   */
  const [loading, setLoading] = useState(true);

  /**
   * État d'erreur
   * - Contient un message d'erreur en cas de problème (login, register, profil).
   */
  const [error, setError] = useState(null);

  /**
   * Effet au montage du composant
   * - Vérifie si un token est présent dans localStorage.
   * - Si oui → charge le profil utilisateur.
   * - Sinon → arrête le chargement.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Charge le profil utilisateur depuis l'API.
   * - Si succès → met à jour l'état `user`.
   * - Si erreur → supprime le token et enregistre l'erreur.
   * - Dans tous les cas → arrête le chargement.
   */
  const loadUser = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connecte un utilisateur.
   * - Envoie les credentials à l'API.
   * - Stocke le token JWT dans localStorage.
   * - Met à jour l'état `user`.
   * 
   * @param {Object} credentials - Identifiants de connexion (email, password).
   * @returns {Promise<Object>} - Données utilisateur et token.
   */
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Inscrit un nouvel utilisateur.
   * - Envoie les données à l'API.
   * - Stocke le token JWT dans localStorage.
   * - Met à jour l'état `user`.
   * 
   * @param {Object} userData - Données d'inscription (name, email, password).
   * @returns {Promise<Object>} - Données utilisateur et token.
   */
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Déconnecte l'utilisateur.
   * - Supprime le token JWT de localStorage.
   * - Réinitialise l'état `user`.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  /**
   * Fournit le contexte d'authentification à l'application.
   * - user : données utilisateur
   * - loading : état de chargement
   * - error : message d'erreur
   * - login : fonction de connexion
   * - register : fonction d'inscription
   * - logout : fonction de déconnexion
   * - isAuthenticated : booléen indiquant si un utilisateur est connecté
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
