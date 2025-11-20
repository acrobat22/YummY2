// backend/models/User.js
import db from "./db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

/**
 * Modèle User
 * 
 * Fournit des méthodes statiques pour gérer les utilisateurs dans la base de données lowdb.
 * Les mots de passe sont stockés sous forme hashée avec bcrypt.
 */
class User {
  /**
   * Retourne tous les utilisateurs sans leur mot de passe.
   * 
   * @async
   * @function findAll
   * @returns {Promise<Array>} - Liste des utilisateurs (sans champ `password`).
   */
  static async findAll() {
    await db.read();
    return db.data.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Retourne un utilisateur par son identifiant.
   * 
   * @async
   * @function findById
   * @param {string} id - Identifiant unique de l'utilisateur.
   * @returns {Promise<Object|null>} - L'utilisateur (sans mot de passe) ou `null` si inexistant.
   */
  static async findById(id) {
    await db.read();
    const user = db.data.users.find((u) => u.id === id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Retourne un utilisateur par son email.
   * 
   * @async
   * @function findByEmail
   * @param {string} email - Email de l'utilisateur.
   * @returns {Promise<Object|null>} - L'utilisateur complet (avec mot de passe hashé) ou `null` si inexistant.
   */
  static async findByEmail(email) {
    await db.read();
    return db.data.users.find((u) => u.email === email);
  }

  /**
   * Crée un nouvel utilisateur.
   * 
   * - Vérifie que l'email n'existe pas déjà.
   * - Hash le mot de passe avec bcrypt.
   * - Ajoute l'utilisateur à la base.
   * 
   * @async
   * @function create
   * @param {Object} userData - Données de l'utilisateur.
   * @param {string} userData.email - Email unique.
   * @param {string} userData.name - Nom de l'utilisateur.
   * @param {string} userData.password - Mot de passe en clair (sera hashé).
   * @throws {Error} - Si l'email existe déjà.
   * @returns {Promise<Object>} - L'utilisateur créé (sans mot de passe).
   */
  static async create(userData) {
    await db.read();

    // Vérifier si l'email existe déjà
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    db.data.users.push(newUser);
    await db.write();

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Compare un mot de passe en clair avec un mot de passe hashé.
   * 
   * @async
   * @function comparePassword
   * @param {string} plainPassword - Mot de passe en clair.
   * @param {string} hashedPassword - Mot de passe hashé stocké en base.
   * @returns {Promise<boolean>} - True si les mots de passe correspondent, sinon false.
   */
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;
