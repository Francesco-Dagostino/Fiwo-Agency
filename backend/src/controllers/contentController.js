import { db } from "../db/client.js";

// ── Factory: genera controllers CRUD para cualquier tabla ─────────────────────
function makeCrud(table, orderCol = "order_index") {
  return {
    // GET /api/:resource  → todos los registros ordenados
    getAll: async (req, res) => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .order(orderCol, { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    },

    // GET /api/:resource/:id
    getOne: async (req, res) => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .eq("id", req.params.id)
        .single();
      if (error) return res.status(404).json({ error: "No encontrado" });
      return res.json(data);
    },

    // POST /api/:resource
    create: async (req, res) => {
      const { data, error } = await db
        .from(table)
        .insert([req.body])
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    },

    // PUT /api/:resource/:id
    update: async (req, res) => {
      const { data, error } = await db
        .from(table)
        .update(req.body)
        .eq("id", req.params.id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    },

    // DELETE /api/:resource/:id
    remove: async (req, res) => {
      const { error } = await db
        .from(table)
        .delete()
        .eq("id", req.params.id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(204).send();
    },
  };
}

// ── Exportar controllers por tabla ────────────────────────────────────────────
export const teamController     = makeCrud("team");
export const servicesController = makeCrud("services");
export const faqController      = makeCrud("faq");

// ── Contact: tabla de una sola fila ───────────────────────────────────────────
export const contactController = {
  // GET /api/contact  → devuelve la única fila
  get: async (req, res) => {
    const { data, error } = await db
      .from("contact_info")
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  // PUT /api/contact  → actualiza la única fila
  update: async (req, res) => {
    const { data: existing } = await db
      .from("contact_info")
      .select("id")
      .single();

    if (!existing) return res.status(404).json({ error: "No hay fila de contacto" });

    const { data, error } = await db
      .from("contact_info")
      .update(req.body)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },
};