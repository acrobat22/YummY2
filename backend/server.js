import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // ⚠️ Port 5000 est utilisé par Apple, donc fallback sur 4000

/**
 * Serveur principal de l'application.
 * 
 * - Configure les middlewares (CORS, JSON parser, fichiers statiques).
 * - Monte les routes d'authentification, d'items et de catégories.
 * - Fournit une route de test racine.
 * - Démarre l'application sur le port défini.
 * 
 * @module server
 */

// --- Middlewares ---

/**
 * Middleware CORS
 * Autorise uniquement les requêtes provenant du frontend (http://localhost:5173).
 * Méthodes autorisées : GET, POST, PUT, DELETE, OPTIONS.
 * Headers autorisés : Content-Type, Authorization.
 */
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parser JSON pour les requêtes entrantes
app.use(express.json());

// Servir des fichiers statiques depuis le dossier "public"
app.use(express.static("public"));

// --- Routes ---

/**
 * Routes d'authentification
 * @route /api/auth
 */
app.use("/api/auth", authRoutes);

/**
 * Routes de gestion des items
 * @route /api/items
 */
app.use("/api/items", itemRoutes);

/**
 * Routes de gestion des catégories
 * @route /api/categories
 */
app.use("/api/categories", categoryRoutes);

/**
 * Route de test
 * @route GET /
 * @returns {JSON} - Message indiquant que l'API fonctionne.
 */
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// --- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
