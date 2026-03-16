import mongoose from "mongoose";

const QuoteRequestSchema = new mongoose.Schema(
  {
    // A) Identité & contact
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    company: { type: String, required: true, trim: true, maxlength: 160 },
    role: { type: String, required: true, trim: true, maxlength: 120 },

    // B) Nature de la demande
    service: {
      type: String,
      required: true,
      enum: [
        "RONNA_DIGITAL",
        "RONNA_WEB",
        "RONNA_TV",
        "RONNA_DEVELOPPEMENT",
        "RONNA_SECURITE",
        "RONNA_AUDIT",
        "RONNA_FORMATION",
        "RONNA_CONSEIL_MANAGEMENT",
        "AUTRE"
      ]
    },
    subject: { type: String, required: true, trim: true, maxlength: 140 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },

    // C) Cadre projet (optionnel)
    budgetRange: {
      type: String,
      required: false,
      enum: ["LT_300K", "300K_1M", "1M_3M", "GT_3M", "UNKNOWN"]
    },
    timeline: {
      type: String,
      required: false,
      enum: ["URGENT_1_2_WEEKS", "ONE_MONTH", "TWO_THREE_MONTHS", "GT_3_MONTHS", "DISCUSS"]
    },
    preferredContact: {
      type: String,
      required: false,
      enum: ["CALL", "WHATSAPP", "EMAIL", "MEETING"]
    },

    // D) Consentement
    consent: { type: Boolean, required: true },

    // Ops
    status: { type: String, required: true, enum: ["NEW", "IN_PROGRESS", "DONE"], default: "NEW" },
    source: { type: String, required: true, default: "website" },

    // Anti-abus (optionnel)
    ip: { type: String, required: false },
    userAgent: { type: String, required: false }
  },
  { timestamps: true }
);

export const QuoteRequest =
  mongoose.models.QuoteRequest || mongoose.model("QuoteRequest", QuoteRequestSchema);
