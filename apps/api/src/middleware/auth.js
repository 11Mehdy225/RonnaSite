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

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "rg_admin";

export function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.sub || payload?.role !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}