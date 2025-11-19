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

// Routes publiques
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Routes protégées
router.post('/', authenticateToken, createItem);
router.put('/:id', authenticateToken, updateItem);
router.delete('/:id', authenticateToken, deleteItem);

export default router;