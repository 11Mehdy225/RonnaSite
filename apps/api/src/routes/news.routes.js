import express from "express";
import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /api/news?category=PROJET&limit=12&page=1
 */
router.get("/news", async (req, res) => {
  try {
    const db = getDb();

    const category = (req.query.category || "").toString().trim();
    const limit = Math.min(parseInt(req.query.limit || "12", 10), 50);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter = { published: true };
    if (category && category !== "TOUT") filter.category = category;

    const [items, total] = await Promise.all([
      db
        .collection("news")
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          title: 1,
          excerpt: 1,
          category: 1,
          coverImage: 1,
          publishedAt: 1,
           slug: 1
        })
        .toArray(),
      db.collection("news").countDocuments(filter)
    ]);

    res.json({
      ok: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("GET /api/news error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * GET /api/news/:id
 */
router.get("/news/:id", async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const doc = await db.collection("news").findOne({
      _id: new ObjectId(id),
      published: true
    });

    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });
    res.json({ ok: true, item: doc });
  } catch (err) {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

// GET /api/news/slug/:slug
router.get("/news/slug/:slug", async (req, res) => {
  try {
    const db = getDb();
    const { slug } = req.params;

    const doc = await db.collection("news").findOne({
      slug,
      published: true
    });

    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });
    res.json({ ok: true, item: doc });
  } catch (err) {
    console.error("GET /api/news/slug/:slug error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});


export default router;
