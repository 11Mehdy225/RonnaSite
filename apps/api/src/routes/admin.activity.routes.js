import express from "express";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/system-status", requireAdmin, async (req, res) => {
  try {
    const started = Date.now();
    await getDb().command({ ping: 1 });
    return res.json({
      ok: true,
      database: "connected",
      databaseLatencyMs: Date.now() - started,
      emailConfigured: String(process.env.MAIL_ENABLED || "false") === "true" && Boolean(process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS),
      publicUrl: process.env.PUBLIC_SITE_URL || "https://www.ronnagroup.net",
      time: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({ ok: false, database: "unavailable" });
  }
});

router.get("/admin/activity", requireAdmin, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const items = await getDb()
      .collection("admin_activity")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return res.json({ ok: true, items });
  } catch (error) {
    console.error("GET /api/admin/activity error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

router.get("/admin/backup", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const collections = ["news", "projects", "foundation_actions", "quote_requests", "site_content"];
    const data = {};
    for (const name of collections) data[name] = await db.collection(name).find({}).toArray();

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Disposition", `attachment; filename=ronna-backup-${stamp}.json`);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2));
  } catch (error) {
    console.error("GET /api/admin/backup error:", error);
    return res.status(500).json({ ok: false, message: "Sauvegarde impossible" });
  }
});

export default router;
