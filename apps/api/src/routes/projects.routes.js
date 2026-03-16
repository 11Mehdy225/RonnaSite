import express from "express";
import { getDb } from "../config/db.js";

const router = express.Router();

/**
 * GET /api/projects?category=WEB&limit=12&page=1
 */
router.get("/projects", async (req, res) => {
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
        .collection("projects")
        .find(filter)
        .sort({ order: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          title: 1,
          slug: 1,
          excerpt: 1,
          category: 1,
          coverImage: 1,
          publishedAt: 1,
          createdAt: 1,

          // utiles pour le détail et CTA
          content: 1,
          gallery: 1,
          ctaType: 1,
          ctaLabel: 1,
          ctaUrl: 1,
        })
        .toArray(),
      db.collection("projects").countDocuments(filter),
    ]);

    res.json({
      ok: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * GET /api/projects/slug/:slug
 */
router.get("/projects/slug/:slug", async (req, res) => {
  try {
    const db = getDb();
    const { slug } = req.params;

    const doc = await db.collection("projects").findOne({
      slug,
      published: true,
    });

    if (!doc)
      return res.status(404).json({ ok: false, message: "Introuvable" });
    res.json({ ok: true, item: doc });
  } catch (err) {
    console.error("GET /api/projects/slug/:slug error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;
