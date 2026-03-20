import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/upload → sube imagen a Supabase Storage (solo admin)
router.post("/", requireAuth, uploadImage);

export default router;