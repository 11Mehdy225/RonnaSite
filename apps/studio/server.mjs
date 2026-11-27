import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { get as getBlob, head as headBlob, list as listBlobs, put as putBlob } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";
import { EVENTS, getEvent, publicEvent } from "./config/events.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 4173);
const STORAGE_MODE = process.env.STORAGE_MODE === "s3"
  ? "s3"
  : process.env.STORAGE_MODE === "vercel-blob" || process.env.VERCEL
    ? "vercel-blob"
    : "local";
const LOCAL_STORAGE_DIR = path.resolve(process.env.LOCAL_STORAGE_DIR || path.join(__dirname, ".local-storage"));
const SIGNING_SECRET = process.env.UPLOAD_SIGNING_SECRET || "local-development-secret-change-me";
const ADMIN_TOKEN = process.env.ADMIN_ACCESS_TOKEN || "local-admin-token";
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

const s3 = STORAGE_MODE === "s3"
  ? new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
      }
    })
  : null;

const BUCKET = process.env.S3_BUCKET || "";

app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: "100kb" }));

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, message: "Trop de tentatives. Réessayez dans quelques minutes." }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const requestSchema = z.object({
  eventSlug: z.string().min(1).max(80),
  filename: z.string().min(1).max(240),
  contentType: z.string().max(100).optional().default(""),
  size: z.number().int().positive(),
  firstName: z.string().trim().max(80).optional().default(""),
  subgroup: z.string().trim().max(100).optional().default("")
});

const confirmSchema = z.object({ receipt: z.string().min(20) });

function cleanText(value) {
  return String(value || "").replace(/[<>\u0000-\u001f]/g, "").trim();
}

function extensionOf(filename) {
  return path.extname(filename).slice(1).toLowerCase();
}

function mimeFor(extension) {
  return extension === "mov" ? "video/quicktime" : "video/mp4";
}

function encodeReceipt(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SIGNING_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function decodeReceipt(receipt) {
  const [body, signature] = String(receipt).split(".");
  if (!body || !signature) throw new Error("RECEIPT_INVALID");
  const expected = crypto.createHmac("sha256", SIGNING_SECRET).update(body).digest("base64url");
  const valid = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) throw new Error("RECEIPT_INVALID");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || Date.now() > payload.exp) throw new Error("RECEIPT_EXPIRED");
  return payload;
}

function originFor(req) {
  return PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
}

function adminAuthorized(req) {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const expected = Buffer.from(ADMIN_TOKEN);
  const received = Buffer.from(token);
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

async function streamToString(stream) {
  if (typeof stream?.transformToString === "function") return stream.transformToString();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

app.get("/api/health", (_req, res) => {
  const configured = STORAGE_MODE === "local"
    || (STORAGE_MODE === "s3" && Boolean(BUCKET))
    || (STORAGE_MODE === "vercel-blob" && Boolean(process.env.BLOB_STORE_ID && process.env.BLOB_READ_WRITE_TOKEN));
  res.json({ ok: true, service: "ronna-studio-collecte", storage: STORAGE_MODE, configured });
});

app.get("/api/events/:slug", (req, res) => {
  const event = getEvent(req.params.slug);
  if (!event) return res.status(404).json({ ok: false, message: "Cette collecte n’est pas disponible." });
  res.json({ ok: true, event: { ...publicEvent(event), uploadMode: STORAGE_MODE } });
});

app.post("/api/uploads/presign", uploadLimiter, async (req, res, next) => {
  try {
    const input = requestSchema.parse(req.body);
    const event = getEvent(input.eventSlug);
    if (!event) return res.status(404).json({ ok: false, message: "Cette collecte n’est pas disponible." });

    const extension = extensionOf(input.filename);
    const contentType = mimeFor(extension);
    if (!event.acceptedExtensions.includes(extension) || (input.contentType && !event.acceptedMimeTypes.includes(input.contentType))) {
      return res.status(400).json({ ok: false, message: "Choisissez une vidéo MP4 ou MOV." });
    }
    if (input.size > event.maxBytes) {
      return res.status(400).json({ ok: false, message: `La vidéo dépasse la limite de ${Math.round(event.maxBytes / 1024 / 1024)} Mo.` });
    }

    const uploadId = crypto.randomUUID();
    const objectKey = `${event.storagePrefix}/videos/${new Date().toISOString().slice(0, 10)}/${uploadId}.${extension}`;
    const payload = {
      eventSlug: event.slug,
      objectKey,
      size: input.size,
      contentType,
      originalFilename: cleanText(input.filename),
      firstName: cleanText(input.firstName),
      subgroup: cleanText(input.subgroup),
      uploadId,
      exp: Date.now() + 60 * 60 * 1000
    };
    const receipt = encodeReceipt(payload);

    if (STORAGE_MODE === "vercel-blob") {
      if (!process.env.BLOB_STORE_ID || !process.env.BLOB_READ_WRITE_TOKEN) throw new Error("STORAGE_NOT_CONFIGURED");
      return res.json({ ok: true, uploadMode: "vercel-blob", pathname: objectKey, contentType, receipt });
    }

    if (STORAGE_MODE === "s3") {
      if (!BUCKET) throw new Error("STORAGE_NOT_CONFIGURED");
      const command = new PutObjectCommand({ Bucket: BUCKET, Key: objectKey, ContentType: contentType });
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });
      return res.json({ ok: true, uploadUrl, method: "PUT", contentType, receipt });
    }

    const uploadUrl = `${originFor(req)}/api/uploads/local/${encodeURIComponent(receipt)}`;
    res.json({ ok: true, uploadUrl, method: "PUT", contentType, receipt });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ ok: false, message: "Les informations de la vidéo sont invalides." });
    next(error);
  }
});

app.post("/api/uploads/vercel-blob", uploadLimiter, async (req, res, next) => {
  try {
    if (STORAGE_MODE !== "vercel-blob") return res.status(404).end();
    const response = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = decodeReceipt(clientPayload || "");
        const event = getEvent(payload.eventSlug);
        if (!event || pathname !== payload.objectKey || !pathname.startsWith(`${event.storagePrefix}/videos/`)) {
          throw new Error("RECEIPT_INVALID");
        }
        return {
          allowedContentTypes: [payload.contentType],
          maximumSizeInBytes: event.maxBytes,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: clientPayload
        };
      },
      onUploadCompleted: async () => {}
    });
    res.json(response);
  } catch (error) {
    if (["RECEIPT_INVALID", "RECEIPT_EXPIRED"].includes(error.message)) {
      return res.status(400).json({ ok: false, message: "L’autorisation d’envoi n’est plus valide. Recommencez l’envoi." });
    }
    next(error);
  }
});

app.put("/api/uploads/local/:receipt", uploadLimiter, async (req, res, next) => {
  try {
    if (STORAGE_MODE !== "local") return res.status(404).end();
    const payload = decodeReceipt(req.params.receipt);
    const target = path.join(LOCAL_STORAGE_DIR, payload.objectKey);
    await fs.promises.mkdir(path.dirname(target), { recursive: true });

    let bytes = 0;
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > payload.size || bytes > getEvent(payload.eventSlug).maxBytes) req.destroy(new Error("UPLOAD_TOO_LARGE"));
    });
    await pipeline(req, fs.createWriteStream(target, { flags: "wx" }));
    if (bytes !== payload.size) {
      await fs.promises.rm(target, { force: true });
      return res.status(400).json({ ok: false, message: "La vidéo reçue est incomplète." });
    }
    res.status(204).end();
  } catch (error) {
    if (error.code === "EEXIST") return res.status(409).json({ ok: false, message: "Cette vidéo a déjà été envoyée." });
    next(error);
  }
});

app.post("/api/uploads/confirm", uploadLimiter, async (req, res, next) => {
  try {
    const { receipt } = confirmSchema.parse(req.body);
    const payload = decodeReceipt(receipt);
    const event = getEvent(payload.eventSlug);
    if (!event || !payload.objectKey.startsWith(`${event.storagePrefix}/videos/`)) throw new Error("RECEIPT_INVALID");

    let storedSize = 0;
    if (STORAGE_MODE === "vercel-blob") {
      const metadata = await headBlob(payload.objectKey);
      storedSize = Number(metadata.size || 0);
    } else if (STORAGE_MODE === "s3") {
      const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: payload.objectKey }));
      storedSize = Number(head.ContentLength || 0);
    } else {
      const stat = await fs.promises.stat(path.join(LOCAL_STORAGE_DIR, payload.objectKey));
      storedSize = stat.size;
    }
    if (storedSize !== payload.size) return res.status(409).json({ ok: false, message: "Le stockage n’a pas encore confirmé la vidéo." });

    const record = {
      uploadId: payload.uploadId,
      eventSlug: payload.eventSlug,
      objectKey: payload.objectKey,
      originalFilename: payload.originalFilename,
      firstName: payload.firstName,
      subgroup: payload.subgroup,
      contentType: payload.contentType,
      size: storedSize,
      uploadedAt: new Date().toISOString()
    };
    const recordKey = `${event.storagePrefix}/records/${payload.uploadId}.json`;

    if (STORAGE_MODE === "vercel-blob") {
      await putBlob(recordKey, JSON.stringify(record), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true
      });
    } else if (STORAGE_MODE === "s3") {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: recordKey,
        Body: JSON.stringify(record),
        ContentType: "application/json"
      }));
    } else {
      const recordPath = path.join(LOCAL_STORAGE_DIR, recordKey);
      await fs.promises.mkdir(path.dirname(recordPath), { recursive: true });
      await fs.promises.writeFile(recordPath, JSON.stringify(record, null, 2));
    }

    res.json({ ok: true, stored: true, uploadId: payload.uploadId, message: "Vidéo reçue" });
  } catch (error) {
    if (error instanceof z.ZodError || ["RECEIPT_INVALID", "RECEIPT_EXPIRED"].includes(error.message)) {
      return res.status(400).json({ ok: false, message: "La confirmation de l’envoi n’est plus valide. Recommencez l’envoi." });
    }
    if (error.code === "NotFound" || error.name === "NoSuchKey" || error.code === "ENOENT") {
      return res.status(409).json({ ok: false, message: "Le stockage n’a pas encore confirmé la vidéo." });
    }
    next(error);
  }
});

app.get("/api/admin/uploads", adminLimiter, async (req, res, next) => {
  try {
    if (!adminAuthorized(req)) return res.status(401).json({ ok: false, message: "Accès administrateur refusé." });
    const event = getEvent(String(req.query.event || ""));
    if (!event) return res.status(404).json({ ok: false, message: "Événement introuvable." });

    const records = [];
    if (STORAGE_MODE === "vercel-blob") {
      const listed = await listBlobs({ prefix: `${event.storagePrefix}/records/`, limit: 200 });
      for (const object of listed.blobs || []) {
        if (!object.pathname.endsWith(".json")) continue;
        const response = await getBlob(object.pathname, { access: "private" });
        if (response?.stream) records.push(JSON.parse(await streamToString(Readable.fromWeb(response.stream))));
      }
    } else if (STORAGE_MODE === "s3") {
      const listed = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `${event.storagePrefix}/records/`, MaxKeys: 200 }));
      for (const object of listed.Contents || []) {
        if (!object.Key?.endsWith(".json")) continue;
        const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: object.Key }));
        records.push(JSON.parse(await streamToString(response.Body)));
      }
    } else {
      const recordsDir = path.join(LOCAL_STORAGE_DIR, event.storagePrefix, "records");
      const files = await fs.promises.readdir(recordsDir).catch((error) => error.code === "ENOENT" ? [] : Promise.reject(error));
      for (const file of files.filter((name) => name.endsWith(".json"))) {
        records.push(JSON.parse(await fs.promises.readFile(path.join(recordsDir, file), "utf8")));
      }
    }

    const items = await Promise.all(records.map(async (record) => ({
      ...record,
      downloadUrl: STORAGE_MODE === "s3"
        ? await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: record.objectKey }), { expiresIn: 15 * 60 })
        : `${originFor(req)}/api/admin/download/${encodeURIComponent(record.uploadId)}?event=${encodeURIComponent(event.slug)}`
    })));
    items.sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt)));
    res.json({ ok: true, event: publicEvent(event), items });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/download/:uploadId", adminLimiter, async (req, res, next) => {
  try {
    if (!["local", "vercel-blob"].includes(STORAGE_MODE)) return res.status(404).end();
    if (!adminAuthorized(req)) return res.status(401).json({ ok: false, message: "Accès administrateur refusé." });
    const event = getEvent(String(req.query.event || ""));
    if (!event) return res.status(404).end();
    let record;
    if (STORAGE_MODE === "vercel-blob") {
      const recordKey = `${event.storagePrefix}/records/${req.params.uploadId}.json`;
      const result = await getBlob(recordKey, { access: "private", useCache: false });
      if (!result?.stream) return res.status(404).end();
      record = JSON.parse(await streamToString(Readable.fromWeb(result.stream)));
    } else {
      const recordPath = path.join(LOCAL_STORAGE_DIR, event.storagePrefix, "records", `${req.params.uploadId}.json`);
      record = JSON.parse(await fs.promises.readFile(recordPath, "utf8"));
    }
    const downloadName = String(record.originalFilename || `${record.uploadId}.mp4`);
    const encodedName = encodeURIComponent(downloadName).replace(/['()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
    res.setHeader("Content-Type", record.contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedName}`);
    res.setHeader("Cache-Control", "private, no-store");

    if (STORAGE_MODE === "vercel-blob") {
      const result = await getBlob(record.objectKey, { access: "private", useCache: false });
      if (!result?.stream) return res.status(404).end();
      if (result.blob?.contentType) res.setHeader("Content-Type", result.blob.contentType);
      await pipeline(Readable.fromWeb(result.stream), res);
    } else {
      const videoRoot = path.resolve(LOCAL_STORAGE_DIR, event.storagePrefix, "videos");
      const videoPath = path.resolve(LOCAL_STORAGE_DIR, record.objectKey);
      if (!videoPath.startsWith(`${videoRoot}${path.sep}`)) return res.status(400).json({ ok: false, message: "Chemin de vidéo invalide." });
      const stat = await fs.promises.stat(videoPath);
      res.setHeader("Content-Length", String(stat.size));
      await pipeline(fs.createReadStream(videoPath), res);
    }
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname, "public"), { maxAge: process.env.NODE_ENV === "production" ? "1h" : 0 }));

app.get("/", (_req, res) => res.redirect(302, "/rosee-de-l-hermon"));
app.get("/:eventSlug", (req, res, next) => {
  if (!getEvent(req.params.eventSlug)) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((_req, res) => res.status(404).json({ ok: false, message: "Page introuvable." }));
app.use((error, _req, res, _next) => {
  console.error("[studio]", error);
  const message = error.message === "STORAGE_NOT_CONFIGURED"
    ? "Le stockage vidéo n’est pas encore configuré."
    : "Une erreur est survenue. Réessayez dans quelques instants.";
  res.status(500).json({ ok: false, message });
});

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[studio] http://localhost:${PORT} · stockage ${STORAGE_MODE}`);
  });
}

export { app, EVENTS };
export default app;
