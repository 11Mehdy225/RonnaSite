// import express from "express";
// import { ObjectId } from "mongodb";
// import { z } from "zod";
// import { getDb } from "../config/db.js";
// import { requireAdmin } from "../middleware/auth.js";

// const router = express.Router();

// router.get("/admin/quotes", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const status = req.query.status;

//     const q = {};
//     if (status) q.status = status;

//     const items = await db
//       .collection("quote_requests")
//       .find(q)
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .toArray();

//     res.json({ ok: true, items });
//   } catch (e) {
//     res.status(500).json({ ok: false, message: "Erreur serveur" });
//   }
// });

// const UpdateSchema = z.object({
//   status: z.enum(["NEW", "IN_PROGRESS", "DONE"]).optional(),
//   notes: z.string().max(5000).optional()
// });

// router.patch("/admin/quotes/:id", requireAdmin, async (req, res) => {
//   try {
//     const db = getDb();
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ ok: false, message: "ID invalide" });
//     }

//     const data = UpdateSchema.parse(req.body);
//     const update = { ...data, updatedAt: new Date() };

//     const col = db.collection("quote_requests");

//     const r1 = await col.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: update }
//     );

//     if (r1.matchedCount === 0) {
//       return res.status(404).json({ ok: false, message: "Not found" });
//     }

//     const item = await col.findOne({ _id: new ObjectId(id) });
//     return res.json({ ok: true, item });
//   } catch (e) {
//     return res.status(400).json({ ok: false, message: "Bad request" });
//   }
// });

// export default router;

import express from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireAdminCsrf } from "../middleware/adminCsrf.js";

const router = express.Router();

const StatusEnum = z.enum(["NEW", "IN_PROGRESS", "DONE"]);
const StatusQuery = z.enum(["ALL", "NEW", "IN_PROGRESS", "DONE"]).default("ALL");

router.get("/admin/quotes", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();

    const status = StatusQuery.parse(String(req.query.status || "ALL").toUpperCase());
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (status !== "ALL") filter.status = status;

    const [items, total] = await Promise.all([
      db.collection("quote_requests")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("quote_requests").countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return res.status(400).json({ ok: false, message: "Query invalide" });
    }
    console.error("GET /api/admin/quotes error:", e);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

const UpdateSchema = z.object({
  status: StatusEnum.optional(),
  notes: z.string().max(5000).optional(),
});

router.patch("/admin/quotes/:id", requireAdmin,requireAdminCsrf, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "ID invalide" });
    }

    const data = UpdateSchema.parse(req.body);

    // rien à update
    if (!data.status && data.notes === undefined) {
      return res.status(400).json({ ok: false, message: "Aucune donnée à mettre à jour" });
    }

    const update = { ...data, updatedAt: new Date() };
    const col = db.collection("quote_requests");

    const r1 = await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (!r1.matchedCount) {
      return res.status(404).json({ ok: false, message: "Introuvable" });
    }

    const item = await col.findOne({ _id: new ObjectId(id) });
    return res.json({ ok: true, item });
  } catch (e) {
    if (e?.name === "ZodError") {
      return res.status(400).json({ ok: false, message: "Bad request", details: e.errors });
    }
    console.error("PATCH /api/admin/quotes/:id error:", e);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;