// backend/models/db.js
import { Low, JSONFile } from "lowdb";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../db.json");

// Adapter pour écrire dans un fichier JSON
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

/**
 * Initialise la base de données lowdb.
 * 
 * - Lit le fichier `db.json` (créé automatiquement s'il n'existe pas).
 * - Si la base est vide, définit une structure par défaut avec :
 *   - `users` : tableau des utilisateurs
 *   - `categories` : tableau des catégories
 *   - `items` : tableau des items
 * - Écrit la structure initiale dans le fichier.
 * 
 * @async
 * @function initDb
 * @returns {Promise<void>} - Ne retourne rien, mais initialise `db.data`.
 */
async function initDb() {
  await db.read();

  // Structure par défaut si la DB est vide
  db.data ||= {
    users: [],
    categories: [],
    items: [],
  };

  await db.write();
}

// Initialisation au démarrage
initDb();

export default db;

