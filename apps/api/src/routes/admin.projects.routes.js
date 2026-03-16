import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js"; 
import { requireAdminCsrf } from "../middleware/adminCsrf.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

// GET /api/admin/projects?status=ALL|PUBLISHED|DRAFT&limit=50&page=1
router.get("/admin/projects", requireAdmin, async (req, res) => {
  try {
    const db = getDb();

    const status = (req.query.status || "ALL").toString();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (status === "PUBLISHED") filter.published = true;
    if (status === "DRAFT") filter.published = false;

    const [items, total] = await Promise.all([
      db
        .collection("projects")
        .find(filter)
        // .sort({ updatedAt: -1, createdAt: -1 })
        .sort({ published: -1, updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          title: 1,
          excerpt: 1,
          category: 1,
          coverImage: 1,
          published: 1,
          slug: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .toArray(),
      db.collection("projects").countDocuments(filter)
    ]);

    res.json({ ok: true, items, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/admin/projects error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/projects/:id (complet)
router.get("/admin/projects/:id", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection("projects").findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });
    res.json({ ok: true, item: doc });
  } catch {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

// POST /api/admin/projects
router.post("/admin/projects", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const now = new Date();

    const title = String(req.body.title || "").trim();
    const excerpt = String(req.body.excerpt || "").trim();
    const content = String(req.body.content || "").trim();

    if (title.length < 3) return res.status(400).json({ ok: false, message: "Titre requis." });
    if (excerpt.length < 10) return res.status(400).json({ ok: false, message: "Résumé requis." });
    if (content.length < 10) return res.status(400).json({ ok: false, message: "Contenu requis." });

    const published = Boolean(req.body.published);
    const baseSlug = slugify(title);
    const slug = await uniqueSlug(db, baseSlug);

    // const doc = {
    //   title,
    //   excerpt,
    //   content,
    //   category: String(req.body.category || "").trim(),
    //   coverImage: String(req.body.coverImage || "").trim(),
    //   gallery: Array.isArray(req.body.gallery) ? req.body.gallery.map(String) : [],
    //   ctaType: req.body.ctaType === "CONTACT" ? "CONTACT" : "LINK",
    //   ctaLabel: String(req.body.ctaLabel || "").trim(),
    //   ctaUrl: String(req.body.ctaUrl || "").trim(),
    //   published,
    //   publishedAt: published ? now : null,
    //   slug,
    //   createdAt: now,
    //   updatedAt: now
    // };

    const doc = {
  title,
  excerpt,
  content,
  category: String(req.body.category || "").trim(),
  coverImage: String(req.body.coverImage || "").trim(),
  gallery: Array.isArray(req.body.gallery) ? req.body.gallery.map(String) : [],

  // ✅ CTA v2 (aligné front)
  ctaPrimaryLabel: String(req.body.ctaPrimaryLabel || "Voir").trim(),
  ctaPrimaryUrl: String(req.body.ctaPrimaryUrl || "").trim(),
  ctaSecondaryLabel: String(req.body.ctaSecondaryLabel || "Nous écrire").trim(),
  ctaSecondaryType: req.body.ctaSecondaryType === "LINK" ? "LINK" : "CONTACT",
  ctaSecondaryUrl: String(req.body.ctaSecondaryUrl || "").trim(),

  published,
  publishedAt: published ? now : null,
  slug,
  createdAt: now,
  updatedAt: now
};

// si secondary CONTACT => pas d'url
if (doc.ctaSecondaryType === "CONTACT") doc.ctaSecondaryUrl = "";

    const r = await db.collection("projects").insertOne(doc);
    const item = await db.collection("projects").findOne({ _id: r.insertedId });

    res.status(201).json({ ok: true, item });
  } catch (err) {
    console.error("POST /api/admin/projects error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

// PATCH /api/admin/projects/:id
router.patch("/admin/projects/:id", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const now = new Date();

    const _id = new ObjectId(req.params.id);
    const prev = await db.collection("projects").findOne({ _id });
    if (!prev) return res.status(404).json({ ok: false, message: "Introuvable" });

    const title = req.body.title != null ? String(req.body.title).trim() : prev.title;
    const excerpt = req.body.excerpt != null ? String(req.body.excerpt).trim() : prev.excerpt;
    const content = req.body.content != null ? String(req.body.content).trim() : prev.content;

    if (title.length < 3) return res.status(400).json({ ok: false, message: "Titre requis." });
    if (excerpt.length < 10) return res.status(400).json({ ok: false, message: "Résumé requis." });
    if (content.length < 10) return res.status(400).json({ ok: false, message: "Contenu requis." });

    // const next = {
    //   title,
    //   excerpt,
    //   content,
    //   category: req.body.category != null ? String(req.body.category).trim() : prev.category,
    //   coverImage: req.body.coverImage != null ? String(req.body.coverImage).trim() : prev.coverImage,
    //   gallery: Array.isArray(req.body.gallery) ? req.body.gallery.map(String) : prev.gallery,
    //   ctaType: req.body.ctaType === "CONTACT" ? "CONTACT" : (req.body.ctaType === "LINK" ? "LINK" : prev.ctaType),
    //   ctaLabel: req.body.ctaLabel != null ? String(req.body.ctaLabel).trim() : prev.ctaLabel,
    //   ctaUrl: req.body.ctaUrl != null ? String(req.body.ctaUrl).trim() : prev.ctaUrl,
    //   updatedAt: now
    // };
    const next = {
  title,
  excerpt,
  content,
  category: req.body.category != null ? String(req.body.category).trim() : prev.category,
  coverImage: req.body.coverImage != null ? String(req.body.coverImage).trim() : prev.coverImage,
  gallery: Array.isArray(req.body.gallery) ? req.body.gallery.map(String) : prev.gallery,

  // ✅ CTA v2 (aligné front)
  ctaPrimaryLabel: req.body.ctaPrimaryLabel != null ? String(req.body.ctaPrimaryLabel).trim() : (prev.ctaPrimaryLabel || "Voir"),
  ctaPrimaryUrl: req.body.ctaPrimaryUrl != null ? String(req.body.ctaPrimaryUrl).trim() : (prev.ctaPrimaryUrl || ""),
  ctaSecondaryLabel: req.body.ctaSecondaryLabel != null ? String(req.body.ctaSecondaryLabel).trim() : (prev.ctaSecondaryLabel || "Nous écrire"),
  ctaSecondaryType: req.body.ctaSecondaryType === "LINK" ? "LINK" : (req.body.ctaSecondaryType === "CONTACT" ? "CONTACT" : (prev.ctaSecondaryType || "CONTACT")),
  ctaSecondaryUrl: req.body.ctaSecondaryUrl != null ? String(req.body.ctaSecondaryUrl).trim() : (prev.ctaSecondaryUrl || ""),

  updatedAt: now
};

if (next.ctaSecondaryType === "CONTACT") next.ctaSecondaryUrl = "";

    // published switch
    if (typeof req.body.published === "boolean") {
      next.published = req.body.published;
      next.publishedAt = req.body.published ? (prev.publishedAt || now) : null;
    }

    // slug si titre a changé
    if (title !== prev.title) {
      const baseSlug = slugify(title);
      next.slug = await uniqueSlug(db, baseSlug, String(prev._id));
    }

    await db.collection("projects").updateOne({ _id }, { $set: next });
    const item = await db.collection("projects").findOne({ _id });
    res.json({ ok: true, item });
  } catch (err) {
    console.error("PATCH /api/admin/projects/:id error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

// DELETE /api/admin/projects/:id
router.delete("/admin/projects/:id", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const _id = new ObjectId(req.params.id);

    const r = await db.collection("projects").deleteOne({ _id });
    if (r.deletedCount === 0) return res.status(404).json({ ok: false, message: "Introuvable" });

    res.json({ ok: true });
  } catch {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

async function uniqueSlug(db, baseSlug, ignoreId = null) {
  let slug = baseSlug || "projet";
  let i = 0;

  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const exists = await db.collection("projects").findOne(
      ignoreId
        ? { slug: candidate, _id: { $ne: new ObjectId(ignoreId) } }
        : { slug: candidate }
    );
    if (!exists) return candidate;
    i += 1;
  }
}

export default router;