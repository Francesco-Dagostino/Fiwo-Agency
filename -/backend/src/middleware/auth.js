import jwt from "jsonwebtoken";

// Verifica el token JWT en el header Authorization: Bearer <token>
// Si es válido, adjunta el payload en req.admin y llama a next()
// Si no, responde 401

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}