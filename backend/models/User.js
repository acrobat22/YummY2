// backend/models/User.js
import db from "./db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

class User {
  // Requête qui retourne tous les utilisateurs
  static async findAll() {
    await db.read();
    return db.data.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Requête qui retourne un utilisateur selon son identifiant
  static async findById(id) {
    await db.read();
    const user = db.data.users.find((u) => u.id === id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Requête qui retourne un utilisateur par son email
  static async findByEmail(email) {
    await db.read();
    return db.data.users.find((u) => u.email === email);
  }

  // requête du permet de créer un nouvel utilisateur
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

  // Fonction qui compare le mot de passe saisie avec celui hashé en base de données
  // utiliser dans : backend/controllers/authController.js
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;
