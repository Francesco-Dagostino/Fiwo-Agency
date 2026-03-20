import { db } from "../db/client.js";

export async function uploadImage(req, res) {
  const { fileName, fileType, fileData } = req.body;

  if (!fileName || !fileType || !fileData) {
    return res.status(400).json({ error: "fileName, fileType y fileData son requeridos" });
  }

  const buffer = Buffer.from(fileData, "base64");
  const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  const { data, error } = await db.storage
    .from("projects")
    .upload(uniqueName, buffer, {
      contentType: fileType,
      upsert: false,
    });

  // Log para ver el error exacto en la terminal del backend
  if (error) {
    console.error("Supabase Storage error:", error);
    return res.status(500).json({ error: error.message });
  }

  const { data: urlData } = db.storage
    .from("projects")
    .getPublicUrl(uniqueName);

  return res.json({ url: urlData.publicUrl });
}