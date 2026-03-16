// import express from "express";
// import { getDb } from "../config/db.js";
// import { ContactInput } from "../validators/contact.schema.js";
// import { quoteRateLimit } from "../middleware/rateLimit.js";
// import { sendContactMail } from "../services/mailer.js";

// const router = express.Router();

// router.post("/contact", quoteRateLimit, async (req, res) => {
//   const startedAt = Date.now();

//   try {
//     const parsed = ContactInput.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({
//         ok: false,
//         error: "VALIDATION_ERROR",
//         details: parsed.error.flatten(),
//       });
//     }

//     // honeypot => OK sans rien faire
//     if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
//       return res.json({ ok: true });
//     }

//     const db = getDb();
//     const col = db.collection("quote_requests");

//     const p = parsed.data;
//     const meta = (p.meta && typeof p.meta === "object") ? p.meta : {};

//     // ✅ Normalisation: on copie aussi les champs attendus par l’admin
//     const doc = {
//       // payload brut (utile)
//       type: p.type,
//       name: p.name,
//       email: p.email,
//       phone: p.phone || "",
//       subject: p.subject || "",
//       message: p.message,
//       meta,

//       // ✅ Champs “racine” pour l’admin (compat quotes)
//       fullName: p.name,
//       company: meta.company || "",
//       role: meta.role || "",
//       service: meta.service || "",

//       budgetRange: meta.budgetRange || "",
//       timeline: meta.timeline || "",
//       preferredContact: meta.preferredContact || "",

//       consent: meta.consent === true,

//       // ops
//       status: "NEW",
//       source: "website",
//       ip:
//         req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
//         req.socket.remoteAddress,
//       userAgent: req.headers["user-agent"] || undefined,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await col.insertOne(doc);
//     const id = result.insertedId.toString();

//     // Email soft-fail
//     let mailSent = false;
//     let mailSkipped = false;
//     let mailError = null;

//     try {
//       const r = await sendContactMail({
//         to: process.env.MAIL_TO,
//         payload: p,
//         id,
//       });
//       mailSent = !!r?.sent;
//       mailSkipped = !!r?.skipped;
//     } catch (e) {
//       mailError = e?.message || String(e);
//       console.warn("[MAIL] soft fail:", mailError);
//     }

//     return res.status(201).json({
//       ok: true,
//       id,
//       mailSent,
//       mailSkipped,
//       ms: Date.now() - startedAt,
//       ...(mailError ? { mailError } : {}),
//     });
//   } catch (e) {
//     console.error("POST /api/contact error:", e);
//     return res.status(500).json({ ok: false, message: "Erreur serveur" });
//   }
// });

// export default router;

import express from "express";
import { getDb } from "../config/db.js";
import { ContactInput } from "../validators/contact.schema.js";
import { quoteRateLimit } from "../middleware/rateLimit.js";
import { sendContactMail } from "../services/mailer.js";

const router = express.Router();

router.post("/contact", quoteRateLimit, async (req, res) => {
  try {
    const parsed = ContactInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    // honeypot anti-spam
    if (parsed.data.honeypot) return res.status(200).json({ ok: true });

    const db = getDb();
    const col = db.collection("quote_requests");

    const doc = {
      ...parsed.data,
      honeypot: undefined,

      status: "NEW",
      source: "website",
      ip: req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);
    const id = result.insertedId.toString();

    // Email soft-fail (ne bloque pas)
    try {
      await sendContactMail({
        to: process.env.MAIL_TO,
        payload: { ...doc, _id: id },
        id,
      });
    } catch (e) {
      console.warn("[MAIL] soft fail:", e?.message || e);
    }

    return res.status(201).json({ ok: true, id });
  } catch (e) {
    console.error("POST /api/contact error:", e);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

export default router;