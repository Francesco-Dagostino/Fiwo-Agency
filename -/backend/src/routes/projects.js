import { Router } from "express";
import {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ── IMPORTANTE: rutas específicas ANTES que /:id ──────────────────────────────

// GET /api/projects/all  → todos (admin) — debe ir ANTES de /:id
router.get("/all", requireAuth, getAllProjects);

// GET /api/projects      → solo publicados (sitio público)
router.get("/", getProjects);

// GET /api/projects/:id  → uno por id
router.get("/:id", getProject);

// POST /api/projects     → crear (admin)
router.post("/", requireAuth, createProject);

// PUT /api/projects/:id  → actualizar (admin)
router.put("/:id", requireAuth, updateProject);

// DELETE /api/projects/:id → borrar (admin)
router.delete("/:id", requireAuth, deleteProject);

export default router;