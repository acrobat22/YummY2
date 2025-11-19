// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());

// Si tu veux restreindre :
/*
app.use(cors({
  origin: "http://localhost:5173", // ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
*/


app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
