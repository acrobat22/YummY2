// backend/models/Category.js
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Modèle Category
 * 
 * Fournit des méthodes statiques pour gérer les catégories dans la base de données lowdb.
 * Chaque catégorie peut être liée à des items, et la suppression est en cascade.
 */
class Category {
  /**
   * Retourne toutes les catégories.
   * 
   * @async
   * @function findAll
   * @returns {Promise<Array>} - Liste de toutes les catégories.
   */
  static async findAll() {
    await db.read();
    return db.data.categories;
  }

  /**
   * Retourne une catégorie par son identifiant.
   * 
   * @async
   * @function findById
   * @param {string} id - Identifiant unique de la catégorie.
   * @returns {Promise<Object|null>} - La catégorie trouvée ou `null` si inexistante.
   */
  static async findById(id) {
    await db.read();
    return db.data.categories.find((cat) => cat.id === id);
  }

  /**
   * Crée une nouvelle catégorie.
   * 
   * @async
   * @function create
   * @param {Object} categoryData - Données de la catégorie (ex. { name: "Alimentation" }).
   * @returns {Promise<Object>} - La nouvelle catégorie créée.
   */
  static async create(categoryData) {
    await db.read();

    const newCategory = {
      id: uuidv4(),
      ...categoryData,
      createdAt: new Date().toISOString(),
    };

    db.data.categories.push(newCategory);
    await db.write();

    return newCategory;
  }

  /**
   * Met à jour une catégorie existante.
   * 
   * @async
   * @function update
   * @param {string} id - Identifiant unique de la catégorie.
   * @param {Object} categoryData - Données à mettre à jour.
   * @returns {Promise<Object|null>} - La catégorie mise à jour ou `null` si inexistante.
   */
  static async update(id, categoryData) {
    await db.read();

    const index = db.data.categories.findIndex((cat) => cat.id === id);
    if (index === -1) return null;

    db.data.categories[index] = {
      ...db.data.categories[index],
      ...categoryData,
      updatedAt: new Date().toISOString(),
    };

    await db.write();
    return db.data.categories[index];
  }

  /**
   * Supprime une catégorie et ses items associés (cascade).
   * 
   * @async
   * @function delete
   * @param {string} id - Identifiant unique de la catégorie.
   * @returns {Promise<Object>} - Objet indiquant le succès et le nombre d’items supprimés.
   * @property {boolean} success - True si la catégorie a été supprimée.
   * @property {number} deletedItemsCount - Nombre d’items supprimés en cascade.
   */
  static async delete(id) {
    await db.read();

    // Vérifier s'il y a des items liés
    const relatedItems = db.data.items.filter((item) => item.categoryId === id);

    // Delete cascade : supprimer tous les items liés
    db.data.items = db.data.items.filter((item) => item.categoryId !== id);

    // Supprimer la catégorie
    const initialLength = db.data.categories.length;
    db.data.categories = db.data.categories.filter((cat) => cat.id !== id);

    await db.write();

    return {
      success: db.data.categories.length < initialLength,
      deletedItemsCount: relatedItems.length,
    };
  }
}

export default Category;
