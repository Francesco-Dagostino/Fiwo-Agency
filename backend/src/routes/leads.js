import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { searchLeads, getLeads, updateLead, deleteLead } from "../controllers/leadsController.js";

const router = Router();

// Todas las rutas requieren auth (igual que projects)
router.use(requireAuth);

router.post("/search", searchLeads);   // POST /api/leads/search
router.get("/", getLeads);             // GET  /api/leads
router.patch("/:id", updateLead);      // PATCH /api/leads/:id
router.delete("/:id", deleteLead);     // DELETE /api/leads/:id

export default router;