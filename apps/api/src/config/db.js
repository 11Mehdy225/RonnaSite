import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export async function connectMongo() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) throw new Error("❌ MONGODB_URI manquant");
  if (!dbName) throw new Error("❌ MONGODB_DB manquant");

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  db = client.db(dbName);

  await db.command({ ping: 1 });
  console.log(`✅ MongoDB connecté à la base : ${dbName}`);

  return db;
}

export function getDb() {
  if (!db) throw new Error("❌ MongoDB non connecté");
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("🛑 MongoDB fermée");
  }
}
