import { Router } from "express";
import { login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login  → genera token JWT
router.post("/login", login);

// GET  /api/auth/me     → verifica token y devuelve datos del admin
router.get("/me", requireAuth, me);

export default router;