import { ContactRequestInput } from "../validators/contactRequest.schema.js";
import { ContactRequest } from "../models/contactRequest.js";
import { sendMail } from "../services/mailer.js";

export async function createContactRequest(req, res) {
  const parsed = ContactRequestInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

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

  const created = await ContactRequest.create(doc);

  // Email soft-fail
  try {
    await sendMail({
      to: process.env.MAIL_TO,
      subject: `[Site] Contact — ${doc.subject || "Nouveau message"}`,
      template: "contact",
      data: {
        name: doc.name,
        email: doc.email,
        phone: doc.phone || "",
        message: doc.message,
        subject: doc.subject || ""
      }
    });
  } catch (e) {
    console.error("MAIL_ERROR", e);
  }

  return res.status(201).json({ ok: true, requestId: created._id.toString() });
}