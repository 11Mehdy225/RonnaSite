import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectMongo, closeMongo, getDb } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import quoteRoutes from "./routes/quote.routes.js";
import newsRoutes from "./routes/news.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import foundationRoutes from "./routes/foundation.routes.js";
import adminFoundationRoutes from "./routes/admin.foundation.routes.js";
import adminAuthRoutes from "./routes/admin.auth.routes.js";
import adminQuotesRoutes from "./routes/admin.quotes.routes.js";
import adminNewsRoutes from "./routes/admin.news.routes.js";
import adminProjectsRoutes from "./routes/admin.projects.routes.js";
import adminUploadRoutes from "./routes/admin.upload.routes.js";
import contactRoutes from "./routes/contact.routes.js";



dotenv.config();
console.log("[ENV CHECK] cwd =", process.cwd());
console.log("[ENV CHECK] BREVO_SMTP_HOST =", process.env.BREVO_SMTP_HOST);
console.log("[ENV CHECK] SMTP_HOST =", process.env.SMTP_HOST);

const app = express();
/* ─────────────────────────────────────
   1️⃣ TRUST PROXY (important)
───────────────────────────────────── */
app.set("trust proxy", 1);

/* ─────────────────────────────────────
   2️⃣ SECURITY HEADERS
───────────────────────────────────── */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ─────────────────────────────────────
   3️⃣ BODY SIZE LIMIT
───────────────────────────────────── */
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

/* ─────────────────────────────────────
   4️⃣ CORS
───────────────────────────────────── */
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman, curl
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.disable("x-powered-by");

/* ─────────────────────────────────────
   5️⃣ GLOBAL RATE LIMIT (soft)
───────────────────────────────────── */
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
// Rate limit spécial login (anti brute force)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Rate limit global léger (évite abus)

/* ─────────────────────────────────────
   6️⃣ ROUTES
───────────────────────────────────── */

app.use("/api/admin/auth/login", loginLimiter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", quoteRoutes);
app.use("/api", newsRoutes);
app.use("/api", projectsRoutes);
app.use("/api", foundationRoutes);
app.use("/api", adminFoundationRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api", adminQuotesRoutes);
app.use("/api", adminNewsRoutes);
app.use("/api", adminProjectsRoutes);
app.use("/api", adminUploadRoutes);
app.use("/api", contactRoutes);





// Healthcheck
app.get("/api/health", async (req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });
    res.json({ ok: true, db: "connected", time: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false, db: "not_connected" });
  }
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectMongo();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});

// Fermeture propre
process.on("SIGINT", async () => {
  await closeMongo();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await closeMongo();
  process.exit(0);
});

export default app;
