// import jwt from "jsonwebtoken";

// export function requireAdmin(req, res, next) {
//   try {
//     const header = req.headers.authorization || "";
//     const token = header.startsWith("Bearer ") ? header.slice(7) : null;

//     if (!token) {
//       return res.status(401).json({ ok: false, message: "Unauthorized" });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     if (!payload?.sub || payload?.role !== "ADMIN") {
//       return res.status(403).json({ ok: false, message: "Forbidden" });
//     }

//     req.user = payload;
//     next();
//   } catch (e) {
//     return res.status(401).json({ ok: false, message: "Unauthorized" });
//   }
// }

import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "rg_admin";

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.sub || payload?.role !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const user = await getDb().collection("users").findOne(
      { _id: new ObjectId(payload.sub), role: "ADMIN", isActive: true },
      { projection: { tokenVersion: 1 } }
    );
    if (!user || (user.tokenVersion || 0) !== (payload.tokenVersion || 0)) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}
