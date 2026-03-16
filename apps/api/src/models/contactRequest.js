import mongoose from "mongoose";

const ContactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: false, trim: true, maxlength: 40 },
    subject: { type: String, required: false, trim: true, maxlength: 140 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },

    status: { type: String, required: true, enum: ["NEW", "IN_PROGRESS", "DONE"], default: "NEW" },
    source: { type: String, required: true, default: "website" },

    ip: { type: String, required: false },
    userAgent: { type: String, required: false }
  },
  { timestamps: true }
);

export const ContactRequest =
  mongoose.models.ContactRequest || mongoose.model("ContactRequest", ContactRequestSchema);