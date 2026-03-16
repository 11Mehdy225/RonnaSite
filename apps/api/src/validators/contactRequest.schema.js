import { z } from "zod";

const phoneOptional = z.string().max(40).optional().or(z.literal(""));

export const ContactRequestInput = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: phoneOptional,
  subject: z.string().min(3).max(140).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
  consent: z.literal(true).optional(), // si tu veux
  honeypot: z.string().max(0).optional(),
});