import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectMongo, getDb, closeMongo } from "../config/db.js";

dotenv.config({ path: new URL("../../.env", import.meta.url) });


async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD requis dans .env");
  }

  await connectMongo();
  const db = getDb();

  const exists = await db.collection("users").findOne({ email });
  if (exists) {
    console.log("✅ Admin existe déjà:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.collection("users").insertOne({
    email,
    passwordHash,
    role: "ADMIN",
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: null
  });

  console.log("✅ Admin créé:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await closeMongo();
  });
