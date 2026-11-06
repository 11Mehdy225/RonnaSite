import express from "express";
import { z } from "zod";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const CampaignSchema = z.object({
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  name: z.string().max(120).optional(),
  content: z.string().max(120).optional(),
  term: z.string().max(120).optional(),
  landingPage: z.string().max(240).optional(),
  referrer: z.string().max(120).optional(),
}).strict();
const EventSchema = z.object({
  event: z.enum(["page_view", "tool_click", "tool_started", "tool_completed", "quote_submitted", "whatsapp_click", "phone_click", "email_click"]),
  path: z.string().max(240).default("/"),
  campaign: CampaignSchema.optional().default({}),
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
    const requestedDays = Number(req.query.days || 30);
    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const col = getDb().collection("analytics_events");
    const match = { createdAt: { $gte: since } };
    const [byEvent, topPages, byCampaign, byMedium] = await Promise.all([
      col.aggregate([
        { $match: match },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]).toArray(),
      col.aggregate([
        { $match: { createdAt: { $gte: since }, event: "page_view" } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]).toArray(),
      col.aggregate([
        { $match: match },
        { $group: {
          _id: {
            source: { $ifNull: ["$campaign.source", "direct"] },
            medium: { $ifNull: ["$campaign.medium", "none"] },
            name: { $ifNull: ["$campaign.name", "not_set"] },
          },
          pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } },
          toolStarts: { $sum: { $cond: [{ $eq: ["$event", "tool_started"] }, 1, 0] } },
          toolCompletions: { $sum: { $cond: [{ $eq: ["$event", "tool_completed"] }, 1, 0] } },
          leads: { $sum: { $cond: [{ $eq: ["$event", "quote_submitted"] }, 1, 0] } },
          whatsappClicks: { $sum: { $cond: [{ $eq: ["$event", "whatsapp_click"] }, 1, 0] } },
        } },
        { $sort: { pageViews: -1 } },
        { $limit: 30 },
      ]).toArray(),
      col.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ["$campaign.medium", "none"] }, count: { $sum: 1 }, leads: { $sum: { $cond: [{ $eq: ["$event", "quote_submitted"] }, 1, 0] } } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ]);
    return res.json({ ok: true, days, since, byEvent, topPages, byCampaign, byMedium });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;
