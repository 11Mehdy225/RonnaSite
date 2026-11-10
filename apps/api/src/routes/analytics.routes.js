import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const ALLOWED_SOURCES = new Set(["facebook", "instagram", "google", "linkedin", "whatsapp", "email", "meta_ads", "google_ads", "direct"]);
const ALLOWED_MEDIUMS = new Set(["paid_social", "cpc", "social", "email", "referral", "paid", "none"]);
const CAMPAIGN_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const BOT_PATTERN = /bot|crawler|spider|preview|facebookexternalhit|facebot|slackbot|curl|wget|headless/i;
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Trop de mesures envoyées" },
});
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
  sessionId: z.string().min(8).max(80),
  version: z.literal(2),
  campaign: CampaignSchema.optional().default({}),
});

function cleanCampaign(input = {}) {
  const rawSource = String(input.source || "direct").toLowerCase();
  const rawMedium = String(input.medium || "none").toLowerCase();
  const referralSource = rawMedium === "referral" && /^[a-z0-9.-]{3,120}$/.test(rawSource);
  const source = ALLOWED_SOURCES.has(rawSource) || referralSource ? rawSource : "direct";
  const medium = ALLOWED_MEDIUMS.has(rawMedium) ? rawMedium : "none";
  const requestedName = String(input.name || "not_set").toLowerCase();
  const trackedCampaign = ALLOWED_SOURCES.has(rawSource) && rawSource !== "direct" && !["none", "referral"].includes(rawMedium);
  const name = trackedCampaign && CAMPAIGN_PATTERN.test(requestedName) ? requestedName : "not_set";
  return { ...input, source, medium, name };
}

router.post("/analytics/event", analyticsLimiter, async (req, res) => {
  if (BOT_PATTERN.test(req.get("user-agent") || "")) return res.status(204).end();
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, message: "Événement invalide" });
  try {
    const event = { ...parsed.data, campaign: cleanCampaign(parsed.data.campaign) };
    const dedupeKey = `${event.sessionId}:${event.event}:${event.path}`;
    await getDb().collection("analytics_events").updateOne(
      { dedupeKey },
      { $setOnInsert: { ...event, dedupeKey, createdAt: new Date() } },
      { upsert: true }
    );
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
    const [byEvent, topPages, byCampaign, byMedium, uniqueSessions] = await Promise.all([
      col.aggregate([
        { $match: match },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]).toArray(),
      col.aggregate([
        { $match: { createdAt: { $gte: since }, event: "page_view" } },
        { $group: { _id: "$path", count: { $sum: 1 }, sessions: { $addToSet: "$sessionId" } } },
        { $set: { uniqueSessions: { $size: "$sessions" } } },
        { $unset: "sessions" },
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
          sessions: { $addToSet: "$sessionId" },
        } },
        { $set: { uniqueSessions: { $size: "$sessions" } } },
        { $unset: "sessions" },
        { $sort: { pageViews: -1 } },
        { $limit: 30 },
      ]).toArray(),
      col.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ["$campaign.medium", "none"] }, pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } }, leads: { $sum: { $cond: [{ $eq: ["$event", "quote_submitted"] }, 1, 0] } }, sessions: { $addToSet: "$sessionId" } } },
        { $set: { uniqueSessions: { $size: "$sessions" } } },
        { $unset: "sessions" },
        { $sort: { uniqueSessions: -1 } },
      ]).toArray(),
      col.distinct("sessionId", { ...match, event: "page_view", sessionId: { $type: "string" } }),
    ]);
    return res.json({ ok: true, days, since, uniqueSessions: uniqueSessions.length, byEvent, topPages, byCampaign, byMedium });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;
