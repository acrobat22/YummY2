// backend/models/Item.js
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";

class Item {
  // Requête pour retourner toutes les items en base de données
  static async findAll() {
    await db.read();
    return db.data.items;
  }

  // Requête pour un item par son identifiant
  static async findById(id) {
    await db.read();
    return db.data.items.find((item) => item.id === id);
  }

  // Requête pour les items par catégories
  static async findByCategory(categoryId) {
    await db.read();
    return db.data.items.filter((item) => item.categoryId === categoryId);
  }

  // Requête pour créer un item en base de données
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

  // Requête pour mettre à jour un item en base de données
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

  // Requête pour supprimer un item en base de données
  static async delete(id) {
    await db.read();

    const initialLength = db.data.items.length;
    db.data.items = db.data.items.filter((item) => item.id !== id);

    await db.write();

    return db.data.items.length < initialLength;
  }
}

export default Item;
