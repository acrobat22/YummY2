// backend/models/db.js
import { Low, JSONFile } from "lowdb";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../db.json");

// Adapter pour écrire dans un fichier JSON
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

// Initialiser la base de données
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

initDb();

export default db;
