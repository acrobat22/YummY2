// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Contrôleur pour la gestion des auth
 * @module authController
 */

/**
 * Enregistre un nouvel utilisateur.
 * 
 * @async
 * @function register
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Données envoyées par le client.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe en clair.
 * @param {string} req.body.name - Nom de l'utilisateur.
 * @param {Object} res - Objet de réponse Express.
 * @returns {JSON} - Retourne un message, l'utilisateur créé (sans mot de passe) et un token JWT.
 */

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const user = await User.create({ email, password, name });
    
    // Créer le token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error("Erreur lors du register:", err); // 👈 log complet
    res.status(400).json({ message: error.message });
  }
};


/**
 * Connecte un utilisateur existant.
 * 
 * @async
 * @function login
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Données envoyées par le client.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe en clair.
 * @param {Object} res - Objet de réponse Express.
 * @returns {JSON} - Retourne un message, l'utilisateur (sans mot de passe) et un token JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Trouver l'utilisateur
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Créer le token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère le profil de l'utilisateur connecté.
 * 
 * @async
 * @function getProfile
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.user - Utilisateur injecté par le middleware d'authentification.
 * @param {string} req.user.id - Identifiant de l'utilisateur.
 * @param {Object} res - Objet de réponse Express.
 * @returns {JSON} - Retourne l'utilisateur sans mot de passe.
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
