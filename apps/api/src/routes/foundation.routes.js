import express from "express";
import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /api/foundation/actions
 * -> liste pour slider (on peut exclure details pour alléger)
 */
router.get("/foundation/actions", async (req, res) => {
  try {
    const db = getDb();

    const items = await db
      .collection("foundation_actions")
      .find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .project({
        title: 1,
        slug: 1,
        short: 1,
        image: 1,
        order: 1,
        eventDate:1,
        createdAt: 1,
        updatedAt: 1,
        published: 1
        // details volontairement pas envoyé ici (chargé au clic)
      })
      .toArray();

    res.json({ ok: true, items });
  } catch (err) {
    console.error("GET /api/foundation/actions error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

/**
 * GET /api/foundation/actions/:id
 * -> détail au clic (inclut details)
 */
router.get("/foundation/actions/:id", async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const doc = await db.collection("foundation_actions").findOne({
      _id: new ObjectId(id),
      published: true
    });

    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });

    res.json({
      ok: true,
      item: {
        _id: doc._id,
        title: doc.title,
        slug: doc.slug,
        short: doc.short,
        details: doc.details,
        eventDate:doc.eventDate,
        image: doc.image,
        order: doc.order,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });
  } catch (err) {
    res.status(400).json({ ok: false, message: "ID invalide" });
  }
});

export default router;