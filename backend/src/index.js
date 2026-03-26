import express from "express";
import cors    from "cors";

import authRoutes     from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import uploadRoutes   from "./routes/upload.js";
import contentRoutes  from "./routes/content.js";

const app  = express();
const PORT = process.env.PORT ?? 4000;

// CORS: acepta el frontend de Vercel y localhost para desarrollo
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman, Railway health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado para: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/upload",   uploadRoutes);
app.use("/api",          contentRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use((_, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});