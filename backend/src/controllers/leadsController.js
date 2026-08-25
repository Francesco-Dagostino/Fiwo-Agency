import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import "../config/env.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function searchBusinesses(query, limit = 20) {
  if (!process.env.SERPAPI_KEY) {
    throw new Error("SERPAPI_KEY no configurada en el backend");
  }

  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_maps",
      q: query,
      type: "search",
      api_key: process.env.SERPAPI_KEY,
      hl: "es",
      gl: "ar",
    },
  });

  const results = response.data.local_results || [];

  return results.slice(0, limit).map((r) => ({
    name: r.title || "",
    address: r.address || "",
    phone: r.phone || "",
    category: r.type || "",
    rating: r.rating || null,
    reviews: r.reviews || 0,
    website: r.website || null,
    google_maps_link: r.links?.directions || "",
    place_id: r.place_id || "",
  }));
}

async function checkWebsite(url) {
  if (!url) return "none";
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await axios.get(fullUrl, {
      timeout: 6000,
      maxRedirects: 3,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FiwoBot/1.0)" },
      validateStatus: (s) => s < 500,
    });
    return response.status < 400 ? "active" : "inactive";
  } catch {
    return "inactive";
  }
}

function classifyWebStatus(website, status) {
  if (!website || status === "none") return "no_web";
  if (status === "inactive") return "inactive_web";
  return "has_web";
}

async function prospectSearch(query, limit) {
  const businesses = await searchBusinesses(query, limit);
  const BATCH = 5;
  const results = [];

  for (let i = 0; i < businesses.length; i += BATCH) {
    const batch = businesses.slice(i, i + BATCH);
    const checked = await Promise.all(
      batch.map(async (biz) => {
        const webStatus = await checkWebsite(biz.website);
        return { ...biz, web_status: classifyWebStatus(biz.website, webStatus) };
      })
    );
    results.push(...checked);
  }

  return results.sort((a, b) => {
    const p = { no_web: 0, inactive_web: 1, has_web: 2 };
    return p[a.web_status] - p[b.web_status];
  });
}

// ─── Controllers ──────────────────────────────────────────────────────────────

export async function searchLeads(req, res) {
  const { query, limit = 20 } = req.body;

  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: "Escribí al menos 3 caracteres." });
  }

  try {
    const results = await prospectSearch(query.trim(), limit);

    const toInsert = results
      .filter((r) => r.place_id)
      .map((r) => ({
        place_id: r.place_id,
        name: r.name,
        address: r.address,
        phone: r.phone,
        category: r.category,
        rating: r.rating,
        reviews: r.reviews,
        website: r.website,
        google_maps_link: r.google_maps_link,
        web_status: r.web_status,
        search_query: query.trim(),
        last_checked: new Date().toISOString(),
      }));

    if (toInsert.length > 0) {
      const { error } = await supabase
        .from("leads")
        .upsert(toInsert, { onConflict: "place_id" });
      if (error) throw error;
    }

    res.json({
      total: results.length,
      no_web: results.filter((r) => r.web_status === "no_web").length,
      inactive_web: results.filter((r) => r.web_status === "inactive_web").length,
      has_web: results.filter((r) => r.web_status === "has_web").length,
      results,
    });
  } catch (err) {
    const upstreamStatus = err.response?.status;
    const upstreamMessage = err.response?.data?.error;
    console.error("searchLeads error:", {
      message: err.message,
      code: err.code,
      upstreamStatus,
      upstreamMessage,
    });

    const isSerpApiError = axios.isAxiosError(err) || err.message.includes("SERPAPI_KEY");
    res.status(isSerpApiError ? 502 : 500).json({
      error: isSerpApiError
        ? "No se pudo consultar SerpApi. Revisá la configuración del backend."
        : "Error al guardar los leads encontrados.",
    });
  }
}

export async function getLeads(req, res) {
  const { web_status, contacted, limit = 50, offset = 0 } = req.query;

  try {
    let query = supabase
      .from("leads")
      .select("*")
      .order("web_status", { ascending: true })
      .order("last_checked", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (web_status) query = query.eq("web_status", web_status);
    if (contacted !== undefined) query = query.eq("contacted", contacted === "true");

    const { data, error } = await query;
    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getLeads error:", err.message);
    res.status(500).json({ error: "Error al obtener leads." });
  }
}

export async function updateLead(req, res) {
  const { id } = req.params;
  const { contacted, notes, status } = req.body;

  const updates = {};
  if (contacted !== undefined) updates.contacted = contacted;
  if (notes !== undefined) updates.notes = notes;
  if (status !== undefined) updates.crm_status = status;

  try {
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateLead error:", err.message);
    res.status(500).json({ error: "Error al actualizar." });
  }
}

export async function deleteLead(req, res) {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar." });
  }
}
