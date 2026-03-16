import rateLimit from "express-rate-limit";

export const quoteRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 20,                // 20 requêtes / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Trop de requêtes. Réessayez plus tard." }
});