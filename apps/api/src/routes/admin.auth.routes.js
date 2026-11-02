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
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireAdminCsrf } from "../middleware/adminCsrf.js";

const router = express.Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(128),
  newPassword: z.string().min(12).max(128),
});

function getCookieOptions() {
  const secure = process.env.NODE_ENV === "production" || String(process.env.COOKIE_SECURE || "false") === "true";
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
      { sub: String(user._id), role: user.role, email: user.email, tokenVersion: user.tokenVersion || 0 },
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

router.get("/admin/auth/me", requireAdmin, (req, res) => {
  return res.json({ ok: true, user: { sub: req.user.sub, email: req.user.email, role: req.user.role } });
});

router.post("/admin/auth/change-password", requireAdmin, requireAdminCsrf, async (req, res) => {
  try {
    const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);
    if (currentPassword === newPassword) {
      return res.status(400).json({ ok: false, message: "Le nouveau mot de passe doit être différent." });
    }

    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.sub), isActive: true });
    if (!user) return res.status(404).json({ ok: false, message: "Compte introuvable." });

    const validCurrentPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validCurrentPassword) {
      return res.status(401).json({ ok: false, message: "Mot de passe actuel incorrect." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { passwordHash, passwordChangedAt: new Date(), updatedAt: new Date() },
        $inc: { tokenVersion: 1 },
      }
    );

    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res.json({ ok: true, message: "Mot de passe modifié. Reconnexion requise." });
  } catch (error) {
    if (error?.name === "ZodError") {
      return res.status(400).json({ ok: false, message: "Le nouveau mot de passe doit contenir au moins 12 caractères." });
    }
    console.error("POST /api/admin/auth/change-password error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;
