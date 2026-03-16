import express from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const COL = "site_content";
const TEAM_KEY = "team_members";

const nowIso = () => new Date().toISOString();
const asStr = (v) => String(v ?? "").trim();

function validateUrlHttpOrUpload(url) {
  if (!url) return true;
  return /^https?:\/\//i.test(url) || String(url).startsWith("/uploads/");
}

/* ─────────────────────────────────────────────
   Zod Schemas
───────────────────────────────────────────── */

const CeoSchema = z.object({
  title: z.string().trim().min(1).default("Mot du PDG"),
  name: z.string().trim().min(2, "Nom requis (min 2)"),
  role: z.string().trim().min(1).default("PDG"),
  photo: z.string().trim().optional().default(""),
  message: z.string().trim().min(10, "Message trop court (min 10)"),
});

const VideoSchema = z.object({
  title: z.string().trim().min(1).default("Interview"),
  url: z.string().trim().optional().default(""),
  caption: z.string().trim().optional().default(""),
});

const AboutSchema = z.object({
  title: z.string().trim().min(1).default("Le Groupe"),
  coverImage: z.string().trim().optional().default(""),
  content: z.string().trim().min(10, "Contenu trop court (min 10)"),
});

const TeamMemberSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis (min 2)"),
  position: z.string().trim().min(2, "Poste requis (min 2)"),
  photo: z.string().trim().optional().default(""),
  bio: z.string().trim().optional().default(""),
  order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function normalizeKey(key) {
  return asStr(key);
}

function buildDocForKey(key, body) {
  const updatedAt = nowIso();

  if (key === "ceo_message") {
    const parsed = CeoSchema.parse(body || {});
    if (parsed.photo && !validateUrlHttpOrUpload(parsed.photo)) {
      throw new Error("Photo invalide (http(s) ou /uploads/...)");
    }
    return {
      key,
      title: parsed.title || "Mot du PDG",
      name: parsed.name,
      role: parsed.role || "PDG",
      photo: parsed.photo || "",
      message: parsed.message,
      updatedAt,
    };
  }

  if (key === "team_video") {
    const parsed = VideoSchema.parse(body || {});
    if (parsed.url && !/^https?:\/\//i.test(parsed.url)) {
      throw new Error("URL vidéo invalide (http(s) requis)");
    }
    return {
      key,
      title: parsed.title || "Interview",
      url: parsed.url || "",
      caption: parsed.caption || "",
      updatedAt,
    };
  }

  if (key === "about_group") {
    const parsed = AboutSchema.parse(body || {});
    if (parsed.coverImage && !validateUrlHttpOrUpload(parsed.coverImage)) {
      throw new Error("Image invalide (http(s) ou /uploads/...)");
    }
    return {
      key,
      title: parsed.title || "Le Groupe",
      coverImage: parsed.coverImage || "",
      content: parsed.content || "",
      updatedAt,
    };
  }

  if (key === TEAM_KEY) {
    // On force l’usage des endpoints /team pour cohérence
    throw new Error("Use team endpoints");
  }

  throw new Error("Key invalide");
}

function withZodError(err) {
  // Transforme les erreurs Zod en message + errors
  if (err && err.name === "ZodError") {
    const errors = {};
    for (const issue of err.issues || []) {
      const k = issue.path?.[0] ? String(issue.path[0]) : "_";
      errors[k] = issue.message;
    }
    return { message: "Validation", errors };
  }
  return null;
}

async function getTeamItems(db) {
  const doc = await db.collection(COL).findOne({ key: TEAM_KEY }, { projection: { items: 1 } });
  const items = Array.isArray(doc?.items) ? doc.items : [];
  // Tri order puis nom
  items.sort(
    (a, b) =>
      (Number(a.order || 0) - Number(b.order || 0)) ||
      String(a.fullName || "").localeCompare(String(b.fullName || ""))
  );
  // stringify _id
  return items.map((x) => ({ ...x, _id: String(x._id) }));
}

/* ─────────────────────────────────────────────
   GET section by key
   GET /api/admin/site-content/:key
───────────────────────────────────────────── */
router.get("/admin/site-content/:key", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const key = normalizeKey(req.params.key);

    if (key === "team_members") {
      // compat: si quelqu’un tape /team_members, on renvoie la liste
      const items = await getTeamItems(db);
      return res.json({ ok: true, items });
    }

    const doc = await db.collection(COL).findOne({ key });
    return res.json({ ok: true, item: doc || { key } });
  } catch (err) {
    console.error("GET /api/admin/site-content/:key error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/* ─────────────────────────────────────────────
   PUT/PATCH section by key (upsert)
   PUT  /api/admin/site-content/:key
   PATCH /api/admin/site-content/:key
───────────────────────────────────────────── */
async function upsertSiteContentByKey(req, res) {
  try {
    const db = getDb();
    const key = normalizeKey(req.params.key);

    let payload;
    try {
      payload = buildDocForKey(key, req.body);
    } catch (err) {
      const z = withZodError(err);
      if (z) return res.status(400).json({ ok: false, message: z.message, errors: z.errors });
      return res.status(400).json({ ok: false, message: err?.message || "Validation" });
    }

    await db.collection(COL).updateOne(
      { key },
      { $set: payload, $setOnInsert: { key, createdAt: nowIso() } },
      { upsert: true }
    );

    const item = await db.collection(COL).findOne({ key });
    return res.json({ ok: true, item });
  } catch (err) {
    console.error("UPSERT /api/admin/site-content/:key error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
}

router.put("/admin/site-content/:key", requireAdmin, upsertSiteContentByKey);
router.patch("/admin/site-content/:key", requireAdmin, upsertSiteContentByKey);

/* ─────────────────────────────────────────────
   TEAM endpoints
───────────────────────────────────────────── */

/**
 * GET /api/admin/site-content/team
 */
router.get("/admin/site-content/team", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const items = await getTeamItems(db);
    return res.json({ ok: true, items });
  } catch (err) {
    console.error("GET /api/admin/site-content/team error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * POST /api/admin/site-content/team
 */
router.post("/admin/site-content/team", requireAdmin, async (req, res) => {
  try {
    const db = getDb();

    let member;
    try {
      member = TeamMemberSchema.parse(req.body || {});
    } catch (err) {
      const z = withZodError(err);
      if (z) return res.status(400).json({ ok: false, message: z.message, errors: z.errors });
      return res.status(400).json({ ok: false, message: "Validation" });
    }

    if (member.photo && !validateUrlHttpOrUpload(member.photo)) {
      return res.status(400).json({ ok: false, message: "Photo invalide (http(s) ou /uploads/...)" });
    }

    const _id = new ObjectId();
    const item = { _id, ...member };

    await db.collection(COL).updateOne(
      { key: TEAM_KEY },
      {
        $setOnInsert: { key: TEAM_KEY, createdAt: nowIso() },
        $push: { items: item },
        $set: { updatedAt: nowIso() },
      },
      { upsert: true }
    );

    return res.status(201).json({ ok: true, item: { ...item, _id: String(_id) } });
  } catch (err) {
    console.error("POST /api/admin/site-content/team error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * PATCH /api/admin/site-content/team/:id
 * -> renvoie l’item mis à jour (pro)
 */
router.patch("/admin/site-content/team/:id", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const id = String(req.params.id || "").trim();
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "ID invalide" });
    }

    let patch;
    try {
      patch = TeamMemberSchema.parse(req.body || {});
    } catch (err) {
      const z = withZodError(err);
      if (z) return res.status(400).json({ ok: false, message: z.message, errors: z.errors });
      return res.status(400).json({ ok: false, message: "Validation" });
    }

    if (patch.photo && !validateUrlHttpOrUpload(patch.photo)) {
      return res.status(400).json({ ok: false, message: "Photo invalide (http(s) ou /uploads/...)" });
    }

    const r = await db.collection(COL).updateOne(
      { key: TEAM_KEY, "items._id": new ObjectId(id) },
      {
        $set: {
          "items.$.fullName": patch.fullName,
          "items.$.position": patch.position,
          "items.$.photo": patch.photo || "",
          "items.$.bio": patch.bio || "",
          "items.$.order": Number(patch.order || 0),
          "items.$.active": patch.active !== false,
          updatedAt: nowIso(),
        },
      }
    );

    if (!r.matchedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

    // relire l’item mis à jour
    const doc = await db.collection(COL).findOne(
      { key: TEAM_KEY },
      { projection: { items: 1 } }
    );
    const updated = (doc?.items || []).find((x) => String(x._id) === String(id));
    const out = updated ? { ...updated, _id: String(updated._id) } : null;

    return res.json({ ok: true, item: out });
  } catch (err) {
    console.error("PATCH /api/admin/site-content/team/:id error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * DELETE /api/admin/site-content/team/:id
 * -> renvoie ok + id (pro)
 */
router.delete("/admin/site-content/team/:id", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const id = String(req.params.id || "").trim();
    if (!ObjectId.isValid(id)) return res.status(400).json({ ok: false, message: "ID invalide" });

    const r = await db.collection(COL).updateOne(
      { key: TEAM_KEY },
      {
        $pull: { items: { _id: new ObjectId(id) } },
        $set: { updatedAt: nowIso() },
      }
    );

    if (!r.matchedCount) return res.status(404).json({ ok: false, message: "Introuvable" });

    return res.json({ ok: true, id });
  } catch (err) {
    console.error("DELETE /api/admin/site-content/team/:id error:", err);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;