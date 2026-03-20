import { db } from "../db/client.js";

// ── GET /api/projects ──────────────────────────────────────────────────────────
// Público: devuelve solo proyectos publicados, ordenados por fecha desc
export async function getProjects(req, res) {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

// ── GET /api/projects/all ──────────────────────────────────────────────────────
// Protegido (admin): devuelve TODOS los proyectos, incluso los no publicados
export async function getAllProjects(req, res) {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

// ── GET /api/projects/:id ──────────────────────────────────────────────────────
export async function getProject(req, res) {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "Proyecto no encontrado" });
  return res.json(data);
}

// ── POST /api/projects ─────────────────────────────────────────────────────────
// Protegido (admin): crea un nuevo proyecto
export async function createProject(req, res) {
  const { title, client, industry, description, tags, year, image_url, live_url, published } = req.body;

  if (!title || !client || !industry || !description) {
    return res.status(400).json({ error: "title, client, industry y description son requeridos" });
  }

  const { data, error } = await db
    .from("projects")
    .insert([{
      title,
      client,
      industry,
      description,
      tags:      Array.isArray(tags) ? tags : [],
      year:      year ?? new Date().getFullYear(),
      image_url: image_url ?? null,
      live_url:  live_url  ?? null,
      published: published ?? true,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

// ── PUT /api/projects/:id ──────────────────────────────────────────────────────
// Protegido (admin): actualiza un proyecto existente
export async function updateProject(req, res) {
  const allowed = ["title", "client", "industry", "description", "tags", "year", "image_url", "live_url", "published"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  const { data, error } = await db
    .from("projects")
    .update(updates)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

// ── DELETE /api/projects/:id ───────────────────────────────────────────────────
// Protegido (admin): elimina un proyecto
export async function deleteProject(req, res) {
  const { error } = await db
    .from("projects")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}