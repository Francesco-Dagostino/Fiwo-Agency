import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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

// ── Hook genérico para team, services, faq ────────────────────────────────────
export function useContent(resource) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/${resource}`);
      setItems(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const add = async (item) => {
    try {
      const data = await apiFetch(`/api/${resource}`, {
        method: "POST", body: JSON.stringify(item),
      });
      setItems((prev) => [...prev, data]);
      return { data };
    } catch (err) { return { error: err.message }; }
  };

  const update = async (id, item) => {
    try {
      const data = await apiFetch(`/api/${resource}/${id}`, {
        method: "PUT", body: JSON.stringify(item),
      });
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
      return { data };
    } catch (err) { return { error: err.message }; }
  };

  const remove = async (id) => {
    try {
      await apiFetch(`/api/${resource}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
      return {};
    } catch (err) { return { error: err.message }; }
  };

  return { items, loading, error, refetch: fetchItems, add, update, remove };
}

// ── Hook para contacto (una sola fila) ────────────────────────────────────────
export function useContact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    apiFetch("/api/contact")
      .then((data) => setContact(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const update = async (data) => {
    try {
      const updated = await apiFetch("/api/contact", {
        method: "PUT", body: JSON.stringify(data),
      });
      setContact(updated);
      return { data: updated };
    } catch (err) { return { error: err.message }; }
  };

  return { contact, loading, error, update };
}