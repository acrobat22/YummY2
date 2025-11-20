// backend/models/Item.js
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Modèle Item
 * 
 * Fournit des méthodes statiques pour gérer les items dans la base de données lowdb.
 * Chaque item est lié à une catégorie via `categoryId`.
 */
class Item {
  /**
   * Retourne tous les items.
   * 
   * @async
   * @function findAll
   * @returns {Promise<Array>} - Liste de tous les items.
   */
  static async findAll() {
    await db.read();
    return db.data.items;
  }

  /**
   * Retourne un item par son identifiant.
   * 
   * @async
   * @function findById
   * @param {string} id - Identifiant unique de l'item.
   * @returns {Promise<Object|null>} - L'item trouvé ou `null` si inexistant.
   */
  static async findById(id) {
    await db.read();
    return db.data.items.find((item) => item.id === id);
  }

  /**
   * Retourne tous les items appartenant à une catégorie donnée.
   * 
   * @async
   * @function findByCategory
   * @param {string} categoryId - Identifiant de la catégorie.
   * @returns {Promise<Array>} - Liste des items liés à cette catégorie.
   */
  static async findByCategory(categoryId) {
    await db.read();
    return db.data.items.filter((item) => item.categoryId === categoryId);
  }

  /**
   * Crée un nouvel item.
   * 
   * @async
   * @function create
   * @param {Object} itemData - Données de l'item (ex. { name, categoryId }).
   * @throws {Error} - Si la catégorie n'existe pas.
   * @returns {Promise<Object>} - L'item créé.
   */
  static async create(itemData) {
    await db.read();

    // Vérifier que la catégorie existe
    const categoryExists = db.data.categories.find(
      (cat) => cat.id === itemData.categoryId
    );

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const newItem = {
      id: uuidv4(),
      ...itemData,
      createdAt: new Date().toISOString(),
    };

    db.data.items.push(newItem);
    await db.write();

    return newItem;
  }

  /**
   * Met à jour un item existant.
   * 
   * @async
   * @function update
   * @param {string} id - Identifiant unique de l'item.
   * @param {Object} itemData - Données à mettre à jour.
   * @throws {Error} - Si une nouvelle catégorie est spécifiée mais n'existe pas.
   * @returns {Promise<Object|null>} - L'item mis à jour ou `null` si inexistant.
   */
  static async update(id, itemData) {
    await db.read();

    // Si on change la catégorie, vérifier qu'elle existe
    if (itemData.categoryId) {
      const categoryExists = db.data.categories.find(
        (cat) => cat.id === itemData.categoryId
      );

      if (!categoryExists) {
        throw new Error("Category not found");
      }
    }

    const index = db.data.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    db.data.items[index] = {
      ...db.data.items[index],
      ...itemData,
      updatedAt: new Date().toISOString(),
    };

    await db.write();
    return db.data.items[index];
  }

  /**
   * Supprime un item par son identifiant.
   * 
   * @async
   * @function delete
   * @param {string} id - Identifiant unique de l'item.
   * @returns {Promise<boolean>} - True si un item a été supprimé, false sinon.
   */
  static async delete(id) {
    await db.read();

    const initialLength = db.data.items.length;
    db.data.items = db.data.items.filter((item) => item.id !== id);

    await db.write();

    return db.data.items.length < initialLength;
  }
}

export default Item;
