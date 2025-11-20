// backend/routes/itemRoutes.js
import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * Routes de gestion des items
 * 
 * @module itemRoutes
 */

/**
 * @route GET /api/items
 * @description Retourne tous les items.
 * @access Public
 */
router.get('/', getAllItems);

/**
 * @route GET /api/items/:id
 * @description Retourne un item par son identifiant.
 * @access Public
 */
router.get('/:id', getItemById);

/**
 * @route POST /api/items
 * @description Crée un nouvel item (lié à une catégorie existante).
 * @access Private (JWT requis)
 */
router.post('/', authenticateToken, createItem);

/**
 * @route PUT /api/items/:id
 * @description Met à jour un item existant par son identifiant.
 * @access Private (JWT requis)
 */
router.put('/:id', authenticateToken, updateItem);

/**
 * @route DELETE /api/items/:id
 * @description Supprime un item par son identifiant.
 * @access Private (JWT requis)
 */
router.delete('/:id', authenticateToken, deleteItem);

export default router;
