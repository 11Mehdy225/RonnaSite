import express from "express";
import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";
import { requireAdmin } from "../middleware/auth.js"; 
import { requireAdminCsrf } from "../middleware/adminCsrf.js";

const router = express.Router();

function slugify(input = "") {
  const s = String(input || "");
  const slug = s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);

  return slug || "news";
}

async function ensureUniqueSlug(db, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let i = 2;

  // boucle jusqu’à trouver un slug libre
  // excludeId utile quand on UPDATE une news déjà existante
  while (true) {
    const query = excludeId
      ? { slug, _id: { $ne: new ObjectId(excludeId) } }
      : { slug };

    const exists = await db.collection("news").findOne(query, { projection: { _id: 1 } });
    if (!exists) return slug;

    slug = `${baseSlug}-${i}`;
    i += 1;
  }
}

router.get("/admin/news/:id", requireAdmin,async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const doc = await db.collection("news").findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });

    res.json({ ok: true, item: doc });
  } catch (err) {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

/** ADMIN: GET /api/admin/news?status=ALL|PUBLISHED|DRAFT&limit=20&page=1 */
router.get("/admin/news", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const status = (req.query.status || "ALL").toString().trim();
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (status === "PUBLISHED") filter.published = true;
    if (status === "DRAFT") filter.published = false;

    const [items, total] = await Promise.all([
      db.collection("news")
        .find(filter)
        // .sort({ publishedAt: -1, createdAt: -1 })
        .sort({ published: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          title: 1,
          excerpt: 1,
          category: 1,
          coverImage: 1,
          published: 1,
          publishedAt: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .toArray(),
      db.collection("news").countDocuments(filter)
    ]);

    res.json({ ok: true, items, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/admin/news error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/** ADMIN: POST /api/admin/news */
router.post("/admin/news", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const {
      title,
      excerpt,
      content,
      category = "COMMUNIQUE",
      coverImage = "",
      published = false,
      publishedAt = null,
      slug: slugFromClient
    } = req.body || {};

    // Validation minimale
    if (!title || String(title).trim().length < 3) {
      return res.status(400).json({ ok: false, message: "Titre requis (min 3 caractères)." });
    }
    if (!excerpt || String(excerpt).trim().length < 10) {
      return res.status(400).json({ ok: false, message: "Résumé requis (min 10 caractères)." });
    }
    if (!content || String(content).trim().length < 20) {
      return res.status(400).json({ ok: false, message: "Contenu requis (min 20 caractères)." });
    }

    const now = new Date();
    const base = slugify(slugFromClient || title);
    const slug = await ensureUniqueSlug(db, base);

    const doc = {
      title: String(title).trim(),
      excerpt: String(excerpt).trim(),
      content: String(content).trim(),
      category: String(category || "COMMUNIQUE").trim(),
      coverImage: String(coverImage || "").trim(),
      slug,
      published: Boolean(published),
      publishedAt: published ? (publishedAt ? new Date(publishedAt) : now) : null,
      createdAt: now,
      updatedAt: now
    };

    const r = await db.collection("news").insertOne(doc);
    const item = await db.collection("news").findOne({ _id: r.insertedId });

    res.status(201).json({ ok: true, item });
  } catch (err) {
    console.error("POST /api/admin/news error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/** ADMIN: PATCH /api/admin/news/:id */
router.patch("/admin/news/:id", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = await db.collection("news").findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ ok: false, message: "Introuvable" });

    const patch = {};
    const body = req.body || {};
    const now = new Date();

    if (body.title !== undefined) patch.title = String(body.title).trim();
    if (body.excerpt !== undefined) patch.excerpt = String(body.excerpt).trim();
    if (body.content !== undefined) patch.content = String(body.content).trim();
    if (body.category !== undefined) patch.category = String(body.category).trim();
    if (body.coverImage !== undefined) patch.coverImage = String(body.coverImage).trim();
    if (body.published !== undefined) patch.published = Boolean(body.published);

    // slug : si title change, on peut régénérer OU respecter slug fourni
    if (body.slug !== undefined || body.title !== undefined) {
      const base = slugify(body.slug || patch.title || existing.title);
      patch.slug = await ensureUniqueSlug(db, base, id);
    }

    // publishedAt
    // if (patch.published === true) {
    //   patch.publishedAt = body.publishedAt ? new Date(body.publishedAt) : (existing.publishedAt || now);
    // }
    // if (patch.published === false) {
    //   patch.publishedAt = null;
    // }
    if (patch.published === true) {
  patch.publishedAt = body.publishedAt
    ? new Date(body.publishedAt)
    : (existing.publishedAt || now);
}

    patch.updatedAt = now;

    await db.collection("news").updateOne({ _id: new ObjectId(id) }, { $set: patch });
    const item = await db.collection("news").findOne({ _id: new ObjectId(id) });

    res.json({ ok: true, item });
  } catch (err) {
    console.error("PATCH /api/admin/news/:id error:", err);
    res.status(400).json({ ok: false, message: "Requête invalide" });
  }
});

/** ADMIN: DELETE /api/admin/news/:id */
router.delete("/admin/news/:id", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const r = await db.collection("news").deleteOne({ _id: new ObjectId(id) });
    if (r.deletedCount === 0) return res.status(404).json({ ok: false, message: "Introuvable" });

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/news/:id error:", err);
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

export default router;
