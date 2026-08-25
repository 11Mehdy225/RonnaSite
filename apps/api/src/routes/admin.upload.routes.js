import express from "express";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireAdminCsrf } from "../middleware/adminCsrf.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Format image non supporté"), ok);
  }
});

// POST /api/admin/upload (form-data: file)
router.post("/admin/upload", requireAdmin, requireAdminCsrf, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: "Fichier requis." });

    const bucket = new GridFSBucket(getDb(), { bucketName: "media" });
    const filename = `rg_${Date.now()}_${req.file.originalname || "image"}`;
    const stream = bucket.openUploadStream(filename, {
      metadata: { contentType: req.file.mimetype },
    });

    await new Promise((resolve, reject) => {
      stream.once("finish", resolve);
      stream.once("error", reject);
      stream.end(req.file.buffer);
    });

    const url = `/api/media/${stream.id}`;

    res.json({
      ok: true,
      url,
      filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (e) {
    res.status(400).json({ ok: false, message: e?.message || "Upload échoué" });
  }
});

export default router;
