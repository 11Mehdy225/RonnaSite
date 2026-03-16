// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { z } from "zod";
// import { getDb } from "../config/db.js";

// const router = express.Router();

// const LoginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6)
// });

// router.post("/admin/auth/login", async (req, res) => {
//   try {
//     const { email, password } = LoginSchema.parse(req.body);
//     const db = getDb();

//     const user = await db.collection("users").findOne({ email });
//     if (!user || user.isActive !== true) {
//       return res.status(401).json({ ok: false, message: "Identifiants invalides" });
//     }

//     const ok = await bcrypt.compare(password, user.passwordHash);
//     if (!ok) return res.status(401).json({ ok: false, message: "Identifiants invalides" });

//     await db.collection("users").updateOne(
//       { _id: user._id },
//       { $set: { lastLoginAt: new Date() } }
//     );

//     const token = jwt.sign(
//       { sub: String(user._id), role: user.role, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ ok: true, token, role: user.role });
//   } catch (e) {
//     return res.status(400).json({ ok: false, message: "Bad request" });
//   }
// });

// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb } from "../config/db.js";

const router = express.Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function getCookieOptions() {
  const secure = String(process.env.COOKIE_SECURE || "false") === "true";
  const sameSite = (process.env.COOKIE_SAMESITE || "lax"); // "lax" | "strict" | "none"
  const days = Number(process.env.COOKIE_MAX_AGE_DAYS || 7);

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: days * 24 * 60 * 60 * 1000,
  };
}

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "rg_admin";

router.post("/admin/auth/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const db = getDb();

    const user = await db.collection("users").findOne({ email });
    if (!user || user.isActive !== true) {
      return res.status(401).json({ ok: false, message: "Identifiants invalides" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ ok: false, message: "Identifiants invalides" });

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    const token = jwt.sign(
      { sub: String(user._id), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Cookie httpOnly
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    // ✅ On ne renvoie plus le token au front
    return res.json({ ok: true, role: user.role });
  } catch (e) {
    return res.status(400).json({ ok: false, message: "Bad request" });
  }
});

router.post("/admin/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
});

router.get("/admin/auth/me", async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true, user: { sub: payload.sub, email: payload.email, role: payload.role } });
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
});

export default router;