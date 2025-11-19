import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // 5000 utilisé par apple

// --- Middlewares ---
// CORS : autoriser ton frontend
app.use(cors({
  origin: "http://localhost:5173", // ton frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Gérer les requêtes preflight OPTIONS
//app.options("*", cors());

// Parser JSON
app.use(express.json());

// Servir des fichiers statiques (si besoin)
app.use(express.static("public"));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// --- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
