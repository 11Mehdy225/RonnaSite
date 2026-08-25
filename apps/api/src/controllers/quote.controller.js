import { QuoteRequestInput } from "../validators/quoteRequest.schema.js";
import { getDb } from "../config/db.js";
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

  try {
    const now = new Date();
    const result = await getDb().collection("quote_requests").insertOne({
      ...doc,
      createdAt: now,
      updatedAt: now,
    });

    // Email (ne bloque pas la réponse)
    try {
      await sendQuoteEmailToTeam({ ...doc, _id: result.insertedId });
      // await sendAutoAckToClient({ ...doc, _id: result.insertedId });
    } catch (e) {
      console.error("MAIL_ERROR", e);
    }

    return res.status(201).json({
      ok: true,
      requestId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("POST /api/quotes error:", error);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
}
