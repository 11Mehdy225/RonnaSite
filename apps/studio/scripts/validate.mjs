import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EVENTS } from "../config/events.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = ["public/index.html", "public/app.js", "public/styles.css", "public/admin.html", "public/admin.js"];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Fichier manquant: ${file}`);
}
for (const event of Object.values(EVENTS)) {
  const artwork = path.join(root, "public", event.artwork.replace(/^\//, ""));
  if (!fs.existsSync(artwork)) throw new Error(`Affiche manquante: ${event.artwork}`);
}
console.log(`Ronna Studio: ${Object.keys(EVENTS).length} collecte(s) validée(s).`);
