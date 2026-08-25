import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;
let connectionPromise;

export async function connectMongo() {
  if (db) return db;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) throw new Error("❌ MONGODB_URI manquant");
  if (!dbName) throw new Error("❌ MONGODB_DB manquant");

  connectionPromise = (async () => {
    const nextClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    try {
      await nextClient.connect();
      const nextDb = nextClient.db(dbName);
      await nextDb.command({ ping: 1 });
      client = nextClient;
      db = nextDb;
      console.log(`✅ MongoDB connecté à la base : ${dbName}`);
      return db;
    } catch (error) {
      await nextClient.close().catch(() => {});
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
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
    connectionPromise = null;
    console.log("🛑 MongoDB fermée");
  }
}
