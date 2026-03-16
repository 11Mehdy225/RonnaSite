// import { getDb } from "../config/db.js";
// import { QuoteRequestInput } from "../validators/quoteRequest.schema.js";
// import { sendQuoteEmailToTeam, sendAutoAckToClient } from "../services/mailer.js";

// export async function createQuoteRequest(req, res) {
//   const parsed = QuoteRequestInput.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({
//       ok: false,
//       error: "VALIDATION_ERROR",
//       details: parsed.error.flatten()
//     });
//   }

//   // Honeypot anti-spam
//   if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
//     return res.status(200).json({ ok: true });
//   }

//   const db = getDb();
//   const col = db.collection("quote_requests"); // nom clair

//   const doc = {
//     ...parsed.data,
//     honeypot: undefined,
//     status: "NEW",
//     source: "website",
//     ip: req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress,
//     userAgent: req.headers["user-agent"] || undefined,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   };

//   const result = await col.insertOne(doc);

//   // Email (ne bloque pas la réponse)
//   try {
//     await sendQuoteEmailToTeam({ ...doc, _id: result.insertedId });
//     // optionnel : accusé de réception
//     // await sendAutoAckToClient({ ...doc, _id: result.insertedId });
//   } catch (e) {
//     console.error("MAIL_ERROR", e);
//   }

//   return res.status(201).json({
//     ok: true,
//     requestId: result.insertedId.toString()
//   });
// }

import { QuoteRequestInput } from "../validators/quoteRequest.schema.js";
import { QuoteRequest } from "../models/quoteRequest.js"; // ajuste le chemin
import { sendQuoteEmailToTeam /*, sendAutoAckToClient */ } from "../services/mailer.js";

export async function createQuoteRequest(req, res) {
  const parsed = QuoteRequestInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  // Honeypot anti-spam
  if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
    return res.status(200).json({ ok: true });
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.socket.remoteAddress;

  const doc = {
    ...parsed.data,
    honeypot: undefined,
    status: "NEW",
    source: "website",
    ip,
    userAgent: req.headers["user-agent"] || undefined,
  };

  const created = await QuoteRequest.create(doc);

  // Email (ne bloque pas la réponse)
  try {
    await sendQuoteEmailToTeam({ ...doc, _id: created._id });
    // await sendAutoAckToClient({ ...doc, _id: created._id });
  } catch (e) {
    console.error("MAIL_ERROR", e);
  }

  return res.status(201).json({
    ok: true,
    requestId: created._id.toString(),
  });
}