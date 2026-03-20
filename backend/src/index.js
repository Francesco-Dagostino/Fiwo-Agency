import express from "express";
import cors    from "cors";

import authRoutes     from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import uploadRoutes   from "./routes/upload.js";
import contentRoutes  from "./routes/content.js";

const app  = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
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
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});