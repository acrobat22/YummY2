// backend/models/Category.js
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";

class Category {
  // Requête pour retourner toutes les catégories en base de données
  static async findAll() {
    await db.read();
    return db.data.categories;
  }

  // Requête pour retourner une catégorie à partir de son identifiant
  static async findById(id) {
    await db.read();
    return db.data.categories.find((cat) => cat.id === id);
  }

  // Requête pour créer une nouvelle catégorie
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

  // Requête pour mettre à jour une catégorie
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

  // Requête pour supprimer une catégorie (cascade pour supprimer également les items associés)
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
