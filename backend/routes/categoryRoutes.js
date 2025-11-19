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

// Routes publiques
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes protégées
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;