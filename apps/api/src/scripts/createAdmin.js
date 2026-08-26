import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectMongo, getDb, closeMongo } from "../config/db.js";

dotenv.config({ path: new URL("../../.env", import.meta.url) });


async function main() {
  const email = process.env.ADMIN_EMAIL;
  const reset = process.argv.includes("--reset");
  const generatePassword = process.argv.includes("--generate-password");
  const password = generatePassword
    ? crypto.randomBytes(18).toString("base64url")
    : process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD requis dans .env");
  }

  await connectMongo();
  const db = getDb();

  const exists = await db.collection("users").findOne({ email });
  if (exists && !reset) {
    console.log("✅ Admin existe déjà:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        passwordHash,
        role: "ADMIN",
        isActive: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        lastLoginAt: null,
      },
    },
    { upsert: true }
  );

  console.log(exists ? "✅ Mot de passe admin réinitialisé:" : "✅ Admin créé:", email);
  if (generatePassword) console.log(`TEMP_ADMIN_PASSWORD=${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await closeMongo();
  });
