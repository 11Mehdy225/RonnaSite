// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import handlebars from "handlebars";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // templates dans apps/api/src/templates
// const templatesDir = path.join(__dirname, "..", "templates");

// function renderTemplate(name, data) {
//   const filePath = path.join(templatesDir, `${name}.hbs`);
//   const source = fs.readFileSync(filePath, "utf8");
//   const compiled = handlebars.compile(source);
//   return compiled(data);
// }

// function getSmtpConfig() {
//   // Brevo priorité
//   const host = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST;
//   const port = Number(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
//   const secureRaw = process.env.BREVO_SMTP_SECURE ?? process.env.SMTP_SECURE ?? "false";
//   const secure = String(secureRaw).toLowerCase() === "true";

//   const user =
//     process.env.BREVO_SMTP_USER ||
//     process.env.SMTP_USER ||
//     ""; // vide si pas configuré
//   const pass =
//     process.env.BREVO_SMTP_KEY ||
//     process.env.SMTP_PASS ||
//     "";

//   return { host, port, secure, user, pass };
// }

// let _transporter = null;

// function getTransporter() {
//   if (_transporter) return _transporter;

//   const { host, port, secure, user, pass } = getSmtpConfig();

//   console.log("[MAIL] enabled =", String(process.env.MAIL_ENABLED) === "true");
//   console.log("[MAIL] host =", host);
//   console.log("[MAIL] port =", port);
//   console.log("[MAIL] secure =", secure);
//   console.log("[MAIL] user =", user);
//   console.log("[MAIL] pass =", pass ? "OK" : "MISSING");

//   if (!host) throw new Error("SMTP host manquant (BREVO_SMTP_HOST ou SMTP_HOST)");
//   if (!user || !pass) throw new Error("SMTP credentials manquants (user/pass)");

//   _transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure,
//     auth: { user, pass },
//     // utile sur certains réseaux
//     requireTLS: port === 587 && !secure,
//   });

//   return _transporter;
// }



// export async function sendMail({ to, subject, template, data }) {
//   const enabled = String(process.env.MAIL_ENABLED) === "true";
//   if (!enabled) return { skipped: true };

//   const html = renderTemplate(template, data);
//   const transporter = getTransporter();

  

//   return transporter.sendMail({
//     from: process.env.MAIL_FROM || `"RONNA GROUP" <contact@ronna-grp.com>`,
//     to,
//     subject,
//     html,
//     replyTo: data?.email || undefined,
//   });
// }

// export async function sendQuoteEmailToTeam(payload) {
//   return sendMail({
//     to: process.env.MAIL_TO || "loicmehdy00@gmail.com",
//     subject: payload?.subject || "📩 Nouvelle demande de devis",
//     template: "devis",
//     data: payload,
//   });
// }

// export async function sendAutoAckToClient(payload) {
//   return sendMail({
//     to: payload.email,
//     subject: "✅ Nous avons bien reçu votre demande",
//     template: "contact", // ou "ack" si tu crées ack.hbs
//     data: {
//       ...payload,
//       message:
//         "Bonjour,\n\nMerci pour votre message. Notre équipe revient vers vous très vite.\n\n— RONNA GROUP",
//     },
//   });
// }

import nodemailer from "nodemailer";

const MAIL_ENABLED = String(process.env.MAIL_ENABLED || "false") === "true";

const SMTP_HOST = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || "smtp-relay.brevo.com";
const SMTP_PORT = Number(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.BREVO_SMTP_SECURE || process.env.SMTP_SECURE || "false") === "true";
const SMTP_USER = process.env.BREVO_SMTP_USER || process.env.SMTP_USER || "apikey";
const SMTP_PASS = process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS;

console.log("[MAIL] enabled =", MAIL_ENABLED);
console.log("[MAIL] host =", SMTP_HOST);
console.log("[MAIL] port =", SMTP_PORT);
console.log("[MAIL] secure =", SMTP_SECURE);
console.log("[MAIL] user =", SMTP_USER);
console.log("[MAIL] pass =", SMTP_PASS ? "OK" : "MISSING");

let transporter = null;

function getTransporter() {
  if (!MAIL_ENABLED) return null;
  if (!SMTP_PASS) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // 587 => false, 465 => true
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildHtml({ type, name, email, phone, subject, message, meta, id }) {
  const metaLines = meta && typeof meta === "object"
    ? Object.entries(meta)
        .map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(typeof v === "string" ? v : JSON.stringify(v))}</li>`)
        .join("")
    : "";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>${type === "DEVIS" ? "Nouvelle demande de devis" : "Nouveau message de contact"}</h2>
      <p><strong>ID:</strong> ${escapeHtml(id)}</p>
      <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Téléphone:</strong> ${escapeHtml(phone || "-")}</p>
      <p><strong>Objet:</strong> ${escapeHtml(subject || "-")}</p>
      <hr/>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      ${metaLines ? `<hr/><h3>Meta</h3><ul>${metaLines}</ul>` : ""}
    </div>
  `;
}

export async function sendContactMail({ to, payload, id }) {
  const t = getTransporter();
  if (!t) return { skipped: true };

  const mailTo = to || process.env.MAIL_TO;
  const from = process.env.MAIL_FROM || `"RONNA GROUP" <contact@ronna-grp.com>`;
  const replyTo = payload.email;

  const subject =
    (payload.subject && String(payload.subject).trim()) ||
    (payload.type === "DEVIS" ? "📩 Nouvelle demande de devis" : "📨 Nouveau message de contact");

  const html = buildHtml({ ...payload, id, subject });

  await t.sendMail({
    from,
    to: mailTo,
    subject,
    html,
    replyTo
  });

  return { sent: true };
}

// --- COMPAT: anciens controllers (quotes) ---
export async function sendQuoteEmailToTeam(payload) {
  // payload vient de quote.controller: { fullName, email, phone, company, role, service, subject, message, ... }
  // On convertit au format attendu par sendContactMail
  const mapped = {
    type: "DEVIS",
    name: payload.fullName || payload.name || "—",
    email: payload.email,
    phone: payload.phone || "",
    subject: payload.subject || "📩 Nouvelle demande de devis",
    message: payload.message || "",
    honeypot: "",
    meta: {
      company: payload.company,
      role: payload.role,
      service: payload.service,
      budgetRange: payload.budgetRange,
      timeline: payload.timeline,
      preferredContact: payload.preferredContact
    }
  };

  const id = payload?._id?.toString?.() || payload?.requestId?.toString?.() || "—";

  return sendContactMail({
    to: process.env.MAIL_TO,
    payload: mapped,
    id
  });
}

// optionnel (si tu veux garder l'import commenté sans erreur si tu l'actives plus tard)
export async function sendAutoAckToClient(payload) {
  // accusé réception client (simple)
  // ⚠️ Si ton Brevo n’autorise pas encore l’expéditeur, ça peut être "soft-fail"
  const mapped = {
    type: "CONTACT",
    name: payload.fullName || payload.name || "—",
    email: payload.email,
    phone: payload.phone || "",
    subject: "✅ Nous avons bien reçu votre demande",
    message:
      "Bonjour,\n\nMerci pour votre message. Notre équipe revient vers vous très vite.\n\n— RONNA GROUP",
    honeypot: "",
    meta: {}
  };

  const id = payload?._id?.toString?.() || "—";

  return sendContactMail({
    to: payload.email, // envoi au client
    payload: mapped,
    id
  });
}