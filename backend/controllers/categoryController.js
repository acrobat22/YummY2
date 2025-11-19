// backend/controllers/categoryController.js
import Category from "../models/Category.js";

/**
 * Contrôleur pour la gestion des catégories
 * @module categoryController
 */

/**
 * Récupère la liste de toutes les catégories
 * @async
 * @route GET /categories
 * @returns {Object} Réponse JSON contenant un tableau de catégories
 * @throws {Error} Si une erreur se produit lors de la récupération des catégories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une catégorie spécifique par son ID
 * @async
 * @route GET /categories/:id
 * @param {string} req.params.id - L'identifiant unique de la catégorie
 * @returns {Object} Réponse JSON contenant la catégorie
 * @throws {Error} Si une erreur se produit lors de la récupération
 * @example
 * GET /categories/123
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crée une nouvelle catégorie
 * @async
 * @route POST /categories
 * @param {Object} req.body - Données de la nouvelle catégorie
 * @param {string} req.body.name - Nom de la catégorie (requis)
 * @param {string} [req.body.description] - Description de la catégorie (optionnel)
 * @param {string} [req.body.shortTitle] - Titre court de la catégorie (optionnel)
 * @returns {Object} Réponse JSON contenant la catégorie créée
 * @throws {Error} Si une erreur se produit lors de la création
 * @example
 * POST /categories
 * {
 *   "name": "Électronique",
 *   "description": "Produits électroniques",
 *   "shortTitle": "Electro"
 * }
 */
export const createCategory = async (req, res) => {
  try {
    const { 
        name, 
        description,
        shortTitle  // On peut ajouter des champs à ce niveau pas besoin de modifier le fichier backend/models/Category.js
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await Category.create({
      name,
      description,
      shortTitle,
    }); // On peut ajouter des champs à ce niveau pas besoin de modifier le fichier backend/models/Category.js

    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour une catégorie existante
 * @async
 * @route PUT /categories/:id
 * @param {string} req.params.id - L'identifiant unique de la catégorie
 * @param {Object} req.body - Données mises à jour
 * @param {string} [req.body.name] - Nouveau nom de la catégorie
 * @param {string} [req.body.description] - Nouvelle description
 * @param {string} [req.body.shortTitle] - Nouveau titre court
 * @returns {Object} Réponse JSON contenant la catégorie mise à jour
 * @throws {Error} Si une erreur se produit lors de la mise à jour
 * @example
 * PUT /categories/123
 * {
 *   "name": "Nouveau nom",
 *   "description": "Nouvelle description"
 * }
 */
export const updateCategory = async (req, res) => {
    try {
        const { name, description, shortTitle } = req.body;

        if (!name && !description && !shortTitle) {
            return res.status(400).json({ 
                message: 'Au moins un champ doit être fourni' 
            });
        }

        const category = await Category.update(req.params.id, {
            ...(name && { name }),
            ...(description && { description }),
            ...(shortTitle && { shortTitle })
        });

        if (!category) {
            return res.status(404).json({ 
                message: 'Category not found' 
            });
        }

        res.json({ category });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

/**
 * Supprime une catégorie et ses éléments associés
 * @async
 * @route DELETE /categories/:id
 * @param {string} req.params.id - L'identifiant unique de la catégorie
 * @returns {Object} Réponse JSON avec le message de succès et le nombre d'éléments supprimés
 * @throws {Error} Si une erreur se produit lors de la suppression
 * @example
 * DELETE /categories/123
 * @returns
 * {
 *   "message": "Category deleted successfully",
 *   "deletedItemsCount": 5
 * }
 */
export const deleteCategory = async (req, res) => {
  try {
    const result = await Category.delete(req.params.id);

    if (!result.success) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      deletedItemsCount: result.deletedItemsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
