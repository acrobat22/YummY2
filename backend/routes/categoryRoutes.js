// backend/routes/categoryRoutes.js
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Routes de gestion des catégories
 * 
 * @module categoryRoutes
 */

/**
 * @route GET /api/categories
 * @description Retourne toutes les catégories.
 * @access Public
 */
router.get('/', getAllCategories);

/**
 * @route GET /api/categories/:id
 * @description Retourne une catégorie par son identifiant.
 * @access Public
 */
router.get('/:id', getCategoryById);

/**
 * @route POST /api/categories
 * @description Crée une nouvelle catégorie.
 * @access Private (JWT requis)
 */
router.post('/', authenticateToken, createCategory);

/**
 * @route PUT /api/categories/:id
 * @description Met à jour une catégorie existante par son identifiant.
 * @access Private (JWT requis)
 */
router.put('/:id', authenticateToken, updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @description Supprime une catégorie par son identifiant (cascade : supprime aussi les items liés).
 * @access Private (JWT requis)
 */
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
