// backend/middlewares/auth.js
import jwt from 'jsonwebtoken';

/**
 * Middleware d'authentification JWT.
 * 
 * Vérifie la présence et la validité d'un token JWT dans l'en-tête `Authorization`.
 * Le format attendu est : `Bearer <token>`.
 * 
 * - Si aucun token n'est fourni → renvoie une erreur 401 (Unauthorized).
 * - Si le token est invalide ou expiré → renvoie une erreur 403 (Forbidden).
 * - Si le token est valide → ajoute l'objet utilisateur décodé à `req.user` et appelle `next()`.
 * 
 * @function authenticateToken
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.headers - En-têtes HTTP de la requête.
 * @param {string} [req.headers.authorization] - En-tête contenant le token JWT au format "Bearer TOKEN".
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction pour passer au middleware suivant.
 * @returns {void} - Ne retourne rien directement, mais appelle `next()` si le token est valide.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};