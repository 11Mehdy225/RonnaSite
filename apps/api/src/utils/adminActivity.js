import { getDb } from "../config/db.js";

export async function recordAdminActivity(req, action, entity, entityId = "", details = {}) {
  try {
    await getDb().collection("admin_activity").insertOne({
      action,
      entity,
      entityId: String(entityId || ""),
      details,
      actor: req.user?.email || "admin",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Admin activity log error:", error);
  }
}
