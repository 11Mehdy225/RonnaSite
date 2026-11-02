import express from "express";
import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireAdminCsrf } from "../middleware/adminCsrf.js";
import { isMediaReferenced } from "../utils/mediaStorage.js";
import { recordAdminActivity } from "../utils/adminActivity.js";

const router = express.Router();

router.get("/admin/media", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const files = await db.collection("media.files").find({}).sort({ uploadDate: -1 }).limit(limit).toArray();
    const items = await Promise.all(files.map(async (file) => {
      const url = `/api/media/${file._id}`;
      return {
        _id: file._id,
        filename: file.filename,
        size: file.length,
        contentType: file.metadata?.contentType || "application/octet-stream",
        uploadDate: file.uploadDate,
        url,
        referenced: await isMediaReferenced(db, url),
      };
    }));
    return res.json({ ok: true, items });
  } catch (error) {
    console.error("GET /api/admin/media error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

router.delete("/admin/media/:id", requireAdmin, requireAdminCsrf, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ ok: false, message: "ID invalide" });
    const db = getDb();
    const url = `/api/media/${req.params.id}`;
    if (await isMediaReferenced(db, url)) {
      return res.status(409).json({ ok: false, message: "Ce média est encore utilisé par un contenu." });
    }
    const file = await db.collection("media.files").findOne({ _id: new ObjectId(req.params.id) });
    if (!file) return res.status(404).json({ ok: false, message: "Média introuvable" });

    await new GridFSBucket(db, { bucketName: "media" }).delete(file._id);
    await recordAdminActivity(req, "DELETE", "media", file._id, { filename: file.filename });
    return res.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/media/:id error:", error);
    return res.status(500).json({ ok: false, message: "Suppression impossible" });
  }
});

export default router;
