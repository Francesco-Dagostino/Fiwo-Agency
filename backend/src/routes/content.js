import { Router } from "express";
import {
  teamController,
  servicesController,
  faqController,
  contactController,
} from "../controllers/contentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ── Helper: genera rutas CRUD estándar ────────────────────────────────────────
function crudRoutes(router, path, ctrl) {
  router.get   (path,       ctrl.getAll);          // público
  router.get   (`${path}/:id`, ctrl.getOne);       // público
  router.post  (path,       requireAuth, ctrl.create);
  router.put   (`${path}/:id`, requireAuth, ctrl.update);
  router.delete(`${path}/:id`, requireAuth, ctrl.remove);
}

crudRoutes(router, "/team",     teamController);
crudRoutes(router, "/services", servicesController);
crudRoutes(router, "/faq",      faqController);

// ── Contacto: solo GET y PUT (una sola fila) ──────────────────────────────────
router.get("/contact",           contactController.get);
router.put("/contact", requireAuth, contactController.update);

export default router;