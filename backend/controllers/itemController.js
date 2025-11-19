// backend/controllers/itemController.js
import Item from '../models/Item.js';

/**
 * Contrôleur pour la gestion des catégories
 * @module itemController
 */


/**
 * Récupère la liste de tous les items
 * @async
 * @route GET /items
 * @returns {Object} Réponse JSON contenant un tableau de items
 * @throws {Error} Si une erreur se produit lors de la récupération des items
 */
export const getAllItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    let items;
    if (categoryId) {
      items = await Item.findByCategory(categoryId);
    } else {
      items = await Item.findAll();
    }
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un item spécifique par son ID
 * @async
 * @route GET /items/:id
 * @param {string} req.params.id - L'identifiant unique de l'item
 * @returns {Object} Réponse JSON contenant l'item
 * @throws {Error} Si une erreur se produit lors de la récupération
 * @example
 * GET /items/123
 */
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
/**
 * Crée un nouvel item
 * @async
 * @route POST /items
 * @param {Object} req.body - Données du nouvel item
 * @param {string} req.body.name - Nom de l'item (requis)
 * @param {string} [req.body.description] - Description de l'item (requis)
 * @param {number} [req.body.price] - Prix de l'item (requis)
 * @param {number} [req.body.categoryId] - Identifiant de la catégorie (requis)
 * @returns {Object} Réponse JSON contenant l'item créée
 * @throws {Error} Si une erreur se produit lors de la création
 * @example
 * POST /items
 * {
 *   "name": "Électronique",
 *   "description": "Produits électroniques",
 *   "price": 12.3,
 *   "categoryId": 3
 * }
 */
export const createItem = async (req, res) => {
  try {
    const { 
        name, 
        description,
        price,
        categoryId 
    } = req.body;
    
    // c'est à ce niveau que l'on determine sur le champ est optionnel ou non
    if (!name || !categoryId || !price || !description) {
      return res.status(400).json({ message: 'Name, description, price and categoryId are required' });
    }
    
    const item = await Item.create({ name, description, price, categoryId });
    res.status(201).json({ item });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};


/**
 * Met à jour un item existant
 * @async
 * @route POST /items
 * @param {Object} req.body - Données du nouvel item
 * @param {string} req.body.name - Nom de l'item (requis)
 * @param {string} [req.body.description] - Description de l'item (requis)
 * @param {number} [req.body.price] - Prix de l'item (requis)
 * @param {number} [req.body.categoryId] - Identifiant de la catégorie (requis)
 * @returns {Object} Réponse JSON contenant l'item créée
 * @throws {Error} Si une erreur se produit lors de la création
 * @example
 * PUT /items/123
 * {
 *   "name": "Nouveau nom",
 *   "description": "Nouvelle description"
 *   "price": 12.3,
 *   "categoryId": 3
 * }
 */
export const updateItem = async (req, res) => {
  try {
    const item = await Item.update(req.params.id, req.body);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Supprime un item et ses éléments associés
 * @async
 * @route DELETE /items/:id
 * @param {string} req.params.id - L'identifiant unique de l'item
 * @returns {Object} Réponse JSON avec le message de succès et le nombre d'éléments supprimés
 * @throws {Error} Si une erreur se produit lors de la suppression
 * @example
 * DELETE /item/123
 * @returns
 * {
 *   "message": "item deleted successfully",
 *   "deletedItemsCount": 1
 * }
 */
export const deleteItem = async (req, res) => {
  try {
    const success = await Item.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};