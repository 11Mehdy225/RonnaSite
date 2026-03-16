// import express from "express";
// import { getDb } from "../config/db.js";
// import { ObjectId } from "mongodb";
// import { requireAdmin } from "../middleware/auth.js";

// const router = express.Router();

// // helpers
// function slugify(input) {
//   return String(input || "")
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // accents
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, "")
//     .trim();
// }

// function pickBody(body = {}) {
//   const title = String(body.title || "").trim();
//   const short = String(body.short || "").trim();
//   const details = body.details == null ? "" : String(body.details);
//   const image = String(body.image || "").trim();
//   const published = body.published === true;
//   const order = body.order == null || body.order === "" ? null : Number(body.order);

//   const eventDateRaw = String(body.eventDate || "").trim();
//   const eventDate = eventDateRaw ? new Date(eventDateRaw) : null;
//   const eventDateIso =
//     eventDate && !Number.isNaN(eventDate.getTime())
//       ? eventDate.toISOString()
//       : "";

//   let slug = String(body.slug || "").trim();
//   if (!slug) slug = slugify(title);
//   else slug = slugify(slug);

//   return { title, short, details, image, published, order, slug, eventDateIso };
// }

// function validate(payload) {
//   const errors = {};
//   if (!payload.title || payload.title.length < 2) errors.title = "Titre requis (min 2).";
//   if (!payload.slug || payload.slug.length < 2) errors.slug = "Slug requis.";
//   if (!payload.short || payload.short.length < 10) errors.short = "Résumé requis (min 10).";

//   if (payload.image && !/^https?:\/\//i.test(payload.image)) {
//     errors.image = "Image doit être une URL http(s).";
//   }

//   if (payload.order != null && Number.isNaN(payload.order)) {
//     errors.order = "Order invalide.";
//   }

//   if (payload.eventDateIso === "" && String(payload.eventDateRaw || "").trim()) {
//     errors.eventDate = "Date invalide.";
//   }

//   return errors;
// }

// /**
//  * GET /api/admin/foundation/actions?status=ALL|PUBLISHED|DRAFT&limit=50&page=1
//  */
// router.get("/admin/foundation/actions", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();

//     const status = String(req.query.status || "ALL").toUpperCase();
//     const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
//     const page = Math.max(parseInt(req.query.page || "1", 10), 1);
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (status === "PUBLISHED") filter.published = true;
//     if (status === "DRAFT") filter.published = false;

//     const [items, total] = await Promise.all([
//       db
//         .collection("foundation_actions")
//         .find(filter)
//         .sort({ published: -1, eventDate: 1, order: 1, updatedAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .toArray(),
//       db.collection("foundation_actions").countDocuments(filter)
//     ]);

//     res.json({ ok: true, items, page, limit, total, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     console.error("GET /api/admin/foundation/actions error:", err);
//     res.status(500).json({ ok: false, message: "Erreur serveur" });
//   }
// });

// /**
//  * GET /api/admin/foundation/actions/:id
//  */
// router.get("/admin/foundation/actions/:id", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const doc = await db.collection("foundation_actions").findOne({ _id: new ObjectId(req.params.id) });
//     if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });
//     res.json({ ok: true, item: doc });
//   } catch {
//     res.status(400).json({ ok: false, message: "ID invalide" });
//   }
// });

// /**
//  * POST /api/admin/foundation/actions
//  */
// router.post("/admin/foundation/actions", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const now = new Date().toISOString();

//     const payload = pickBody(req.body);
//     const errors = validate(payload);

//     if (Object.keys(errors).length) {
//       return res.status(400).json({ ok: false, message: "Validation", errors });
//     }

//     // slug unique (soft check)
//     const exists = await db.collection("foundation_actions").findOne({ slug: payload.slug });
//     if (exists) {
//       return res.status(409).json({ ok: false, message: "Slug déjà utilisé", errors: { slug: "Slug déjà utilisé." } });
//     }

//     const doc = {
//       title: payload.title,
//       slug: payload.slug,
//       short: payload.short,
//       details: payload.details,
//       image: payload.image || "",
//       eventDate: payload.eventDateIso || "", // ISO string ou vide
//       order: payload.order == null ? 0 : payload.order,
//       published: payload.published,
//       createdAt: now,
//       updatedAt: now
//     };

//     const r = await db.collection("foundation_actions").insertOne(doc);
//     res.status(201).json({ ok: true, id: r.insertedId });
//   } catch (err) {
//     console.error("POST /api/admin/foundation/actions error:", err);
//     res.status(500).json({ ok: false, message: "Erreur serveur" });
//   }
// });

// /**
//  * PATCH /api/admin/foundation/actions/:id
//  */
// router.patch("/admin/foundation/actions/:id", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const id = new ObjectId(req.params.id);

//     const payload = pickBody(req.body);
//     const errors = validate(payload);

//     if (Object.keys(errors).length) {
//       return res.status(400).json({ ok: false, message: "Validation", errors });
//     }

//     // slug unique sauf lui-même
//     const exists = await db.collection("foundation_actions").findOne({ slug: payload.slug, _id: { $ne: id } });
//     if (exists) {
//       return res.status(409).json({ ok: false, message: "Slug déjà utilisé", errors: { slug: "Slug déjà utilisé." } });
//     }

//     const patch = {
//       title: payload.title,
//       slug: payload.slug,
//       short: payload.short,
//       details: payload.details,
//       image: payload.image || "",
//       eventDate: payload.eventDateIso || "",
//       order: payload.order == null ? 0 : payload.order,
//       published: payload.published,
//       updatedAt: new Date().toISOString()
//     };

//     const r = await db.collection("foundation_actions").updateOne({ _id: id }, { $set: patch });
//     if (!r.matchedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

//     res.json({ ok: true });
//   } catch (err) {
//     console.error("PATCH /api/admin/foundation/actions/:id error:", err);
//     res.status(500).json({ ok: false, message: "Erreur serveur" });
//   }
// });

// /**
//  * DELETE /api/admin/foundation/actions/:id
//  */
// router.delete("/admin/foundation/actions/:id", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const id = new ObjectId(req.params.id);

//     const r = await db.collection("foundation_actions").deleteOne({ _id: id });
//     if (!r.deletedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

//     res.json({ ok: true });
//   } catch {
//     res.status(400).json({ ok: false, message: "ID invalide" });
//   }
// });

// export default router;

import express from "express";
import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";
import { requireAdmin } from "../middleware/auth.js";
import { requireAdminCsrf } from "../middleware/adminCsrf.js";

const router = express.Router();

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();
}

function pickBody(body = {}) {
  const title = String(body.title || "").trim();
  const short = String(body.short || "").trim();
  const details = body.details == null ? "" : String(body.details);
  const image = String(body.image || "").trim();
  const published = body.published === true;

  const order =
    body.order == null || body.order === "" ? null : Number(body.order);

  const eventDateRaw = String(body.eventDate || "").trim();
  const eventDate = eventDateRaw ? new Date(eventDateRaw) : null;
  const eventDateIso =
    eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate.toISOString() : "";

  let slug = String(body.slug || "").trim();
  slug = slug ? slugify(slug) : slugify(title);

  return { title, short, details, image, published, order, slug, eventDateIso, eventDateRaw };
}

function validate(p) {
  const errors = {};
  if (!p.title || p.title.length < 2) errors.title = "Titre requis (min 2).";
  if (!p.slug || p.slug.length < 2) errors.slug = "Slug requis.";
  if (!p.short || p.short.length < 10) errors.short = "Résumé requis (min 10).";

  if (p.image && !( /^https?:\/\//i.test(p.image) || p.image.startsWith("/uploads/") )) {
  errors.image = "Image doit être une URL http(s) ou /uploads/...";
}
  if (p.order != null && Number.isNaN(p.order)) errors.order = "Order invalide.";

  if (p.eventDateRaw && p.eventDateIso === "") {
    errors.eventDate = "Date invalide.";
  }

  return errors;
}

/**
 * GET /api/admin/foundation/actions?status=ALL|PUBLISHED|DRAFT&limit=50&page=1
 */
router.get("/admin/foundation/actions", requireAdmin, async (req, res) => {
  try {
    const db = getDb();

    const status = String(req.query.status || "ALL").toUpperCase();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (status === "PUBLISHED") filter.published = true;
    if (status === "DRAFT") filter.published = false;

    const [items, total] = await Promise.all([
      db.collection("foundation_actions")
        .find(filter)
        .sort({ published: -1, order: 1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("foundation_actions").countDocuments(filter),
    ]);

    res.json({ ok: true, items, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/admin/foundation/actions error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

router.get("/admin/foundation/actions/:id", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection("foundation_actions").findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });
    res.json({ ok: true, item: doc });
  } catch {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

router.post("/admin/foundation/actions", requireAdmin, requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const now = new Date().toISOString();

    const payload = pickBody(req.body);
    const errors = validate(payload);
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, message: "Validation", errors });

    const exists = await db.collection("foundation_actions").findOne({ slug: payload.slug });
    if (exists) return res.status(409).json({ ok: false, message: "Slug déjà utilisé", errors: { slug: "Slug déjà utilisé." } });

    const doc = {
      title: payload.title,
      slug: payload.slug,
      short: payload.short,
      details: payload.details,
      image: payload.image || "",
      eventDate: payload.eventDateIso || "",
      order: payload.order == null ? 0 : payload.order,
      published: payload.published,
      createdAt: now,
      updatedAt: now,
    };

    const r = await db.collection("foundation_actions").insertOne(doc);
    const item = await db.collection("foundation_actions").findOne({ _id: r.insertedId });

    res.status(201).json({ ok: true, item });
  } catch (err) {
    console.error("POST /api/admin/foundation/actions error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

router.patch("/admin/foundation/actions/:id", requireAdmin, requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const payload = pickBody(req.body);
    const errors = validate(payload);
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, message: "Validation", errors });

    const exists = await db.collection("foundation_actions").findOne({ slug: payload.slug, _id: { $ne: id } });
    if (exists) return res.status(409).json({ ok: false, message: "Slug déjà utilisé", errors: { slug: "Slug déjà utilisé." } });

    const patch = {
      title: payload.title,
      slug: payload.slug,
      short: payload.short,
      details: payload.details,
      image: payload.image || "",
      eventDate: payload.eventDateIso || "",
      order: payload.order == null ? 0 : payload.order,
      published: payload.published,
      updatedAt: new Date().toISOString(),
    };

    const r = await db.collection("foundation_actions").updateOne({ _id: id }, { $set: patch });
    if (!r.matchedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

    const item = await db.collection("foundation_actions").findOne({ _id: id });
    res.json({ ok: true, item });
  } catch (err) {
    console.error("PATCH /api/admin/foundation/actions/:id error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

router.delete("/admin/foundation/actions/:id", requireAdmin, requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const r = await db.collection("foundation_actions").deleteOne({ _id: id });
    if (!r.deletedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

    res.json({ ok: true });
  } catch {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

export default router;