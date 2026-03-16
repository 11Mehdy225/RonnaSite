import { z } from "zod";

const phoneLoose = z.string().min(6).max(40); // on reste souple CI/intl

export const QuoteRequestInput = z.object({
  // A
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: phoneLoose,
  company: z.string().min(2).max(160),
  role: z.string().min(2).max(120),

  // B
  service: z.enum([
    "RONNA_DIGITAL",
    "RONNA_WEB",
    "RONNA_TV",
    "RONNA_DEVELOPPEMENT",
    "RONNA_SECURITE",
    "RONNA_AUDIT",
    "RONNA_FORMATION",
    "RONNA_CONSEIL_MANAGEMENT",
    "AUTRE"
  ]),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(4000),

  // C (optionnels)
  budgetRange: z.enum(["LT_300K", "300K_1M", "1M_3M", "GT_3M", "UNKNOWN"]).optional(),
  timeline: z.enum(["URGENT_1_2_WEEKS", "ONE_MONTH", "TWO_THREE_MONTHS", "GT_3_MONTHS", "DISCUSS"]).optional(),
  preferredContact: z.enum(["CALL", "WHATSAPP", "EMAIL", "MEETING"]).optional(),

  // D
  consent: z.literal(true),

  // honeypot anti-spam (doit être vide)
  honeypot: z.string().max(0).optional()
});
