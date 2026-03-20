import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// ── Helper HTTP ───────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("sl_token");

  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── useProjects ───────────────────────────────────────────────────────────────
export function useProjects(adminMode = false) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = adminMode ? "/api/projects/all" : "/api/projects";
      const data = await apiFetch(endpoint);
      setProjects(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const add = async (project) => {
    try {
      const data = await apiFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(project),
      });
      setProjects((prev) => [data, ...prev]);
      return { data };
    } catch (err) { return { error: err.message }; }
  };

  const update = async (id, project) => {
    try {
      const data = await apiFetch(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(project),
      });
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      return { data };
    } catch (err) { return { error: err.message }; }
  };

  const remove = async (id) => {
    try {
      await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return {};
    } catch (err) { return { error: err.message }; }
  };

  const togglePublished = (id, current) => update(id, { published: !current });

  return { projects, loading, error, refetch: fetchProjects, add, update, remove, togglePublished };
}

// ── useAuth ───────────────────────────────────────────────────────────────────
export function useAuth() {
  const [authed,  setAuthed]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sl_token");
    if (!token) { setLoading(false); return; }
    apiFetch("/api/auth/me")
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem("sl_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("sl_token", token);
      setAuthed(true);
      return {};
    } catch (err) { return { error: err.message }; }
  };

  const logout = () => {
    localStorage.removeItem("sl_token");
    setAuthed(false);
  };

  return { authed, loading, login, logout };
}

// ── useImageUpload ────────────────────────────────────────────────────────────
// Convierte el archivo a base64 y lo manda al backend → Supabase Storage
// Devuelve { url } con la URL pública de la imagen subida

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const upload = async (file) => {
    if (!file) return { error: "No se seleccionó ningún archivo" };

    // Validar tipo y tamaño (max 5mb)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return { error: "Solo se permiten imágenes JPG, PNG, WEBP o GIF" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "La imagen no puede superar los 5MB" };
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Convertir a base64
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Error leyendo el archivo"));
        reader.readAsDataURL(file);
      });

      const token = localStorage.getItem("sl_token");
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileData,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al subir la imagen");
      }

      const { url } = await res.json();
      return { url };
    } catch (err) {
      setUploadError(err.message);
      return { error: err.message };
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, uploadError };
}