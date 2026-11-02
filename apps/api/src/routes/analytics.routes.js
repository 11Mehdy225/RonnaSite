import express from "express";
import { z } from "zod";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const EventSchema = z.object({
  event: z.enum(["page_view", "quote_submitted", "whatsapp_click", "phone_click", "email_click"]),
  path: z.string().max(240).default("/"),
});

router.post("/analytics/event", async (req, res) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, message: "Événement invalide" });
  try {
    await getDb().collection("analytics_events").insertOne({ ...parsed.data, createdAt: new Date() });
    return res.status(204).end();
  } catch (error) {
    console.error("POST /api/analytics/event error:", error);
    return res.status(500).json({ ok: false });
  }
});

router.get("/admin/analytics", requireAdmin, async (req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const col = getDb().collection("analytics_events");
    const [byEvent, topPages] = await Promise.all([
      col.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]).toArray(),
      col.aggregate([
        { $match: { createdAt: { $gte: since }, event: "page_view" } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]).toArray(),
    ]);
    return res.json({ ok: true, since, byEvent, topPages });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;
