// // apps/api/src/validators/contact.schema.js
// import { z } from "zod";

// export const ContactInput = z
//   .object({
//     type: z.enum(["CONTACT", "DEVIS"]).default("CONTACT"),

//     name: z.string().min(2).max(120),
//     email: z.string().email().max(160),

//     // on accepte "" ou string
//     phone: z.string().max(40).optional().or(z.literal("")).default(""),

//     subject: z.string().max(140).optional().or(z.literal("")).default(""),
//     message: z.string().min(10).max(4000),

//     honeypot: z.string().optional().default(""),

//     // ✅ meta libre (pas de record -> plus d'erreur _zod)
//     meta: z.unknown().optional().default({})
//   })
//   .strict();

import { z } from "zod";

export const ContactInput = z.object({
  type: z.enum(["CONTACT", "DEVIS"]).default("DEVIS"),

  // champs “pro” qu’on stocke au même endroit que les quotes
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(40),
  company: z.string().min(2).max(160),
  role: z.string().min(2).max(120),

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

  budgetRange: z.enum(["LT_300K", "300K_1M", "1M_3M", "GT_3M", "UNKNOWN"]).optional(),
  timeline: z.enum(["URGENT_1_2_WEEKS", "ONE_MONTH", "TWO_THREE_MONTHS", "GT_3_MONTHS", "DISCUSS"]).optional(),
  preferredContact: z.enum(["CALL", "WHATSAPP", "EMAIL", "MEETING"]).optional(),

  consent: z.literal(true),

  honeypot: z.string().optional().default("")
}).strict();