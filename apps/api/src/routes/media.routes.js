import express from "express";
import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

const router = express.Router();

router.get("/media/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = getDb();
    const file = await db.collection("media.files").findOne({ _id: id });

    if (!file) {
      return res.status(404).json({ ok: false, message: "Image introuvable" });
    }

    res.set({
      "Content-Type": file.metadata?.contentType || "application/octet-stream",
      "Content-Length": String(file.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    const bucket = new GridFSBucket(db, { bucketName: "media" });
    const stream = bucket.openDownloadStream(id);
    stream.on("error", (error) => {
      console.error("GET /api/media/:id error:", error);
      if (!res.headersSent) {
        res.status(404).json({ ok: false, message: "Image introuvable" });
      } else {
        res.destroy(error);
      }
    });
    stream.pipe(res);
  } catch {
    res.status(400).json({ ok: false, message: "ID image invalide" });
  }
});

export default router;
