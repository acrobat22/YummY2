// backend/routes/authRoutes.js
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Routes d'authentification
 * 
 * @module authRoutes
 */

/**
 * @route POST /api/auth/register
 * @description Crée un nouvel utilisateur et retourne un token JWT.
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @description Connecte un utilisateur existant et retourne un token JWT.
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /api/auth/profile
 * @description Retourne le profil de l'utilisateur connecté (protégé par JWT).
 * @access Private
 */
router.get('/profile', authenticateToken, getProfile);

export default router;
