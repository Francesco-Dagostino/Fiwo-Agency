import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

// En producción guardarías admins en la BD con passwords hasheados.
// Para arrancar, el admin se define directo en el .env.
// El password en .env se compara contra el hash generado al iniciar el servidor.

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES    = "8h";

// ── POST /api/auth/login ───────────────────────────────────────────────────────
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  const emailMatch    = email === ADMIN_EMAIL;
  const passwordMatch = password === ADMIN_PASSWORD;

  if (!emailMatch || !passwordMatch) {
    // Mismo mensaje para no revelar cuál campo falló
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return res.json({ token, expiresIn: JWT_EXPIRES });
}

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
// Ruta protegida: valida que el token sea válido y devuelve los datos del admin
export function me(req, res) {
  return res.json({ email: req.admin.email, role: req.admin.role });
}