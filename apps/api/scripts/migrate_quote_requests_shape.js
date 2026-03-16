import { MongoClient } from "mongodb";
import "dotenv/config";

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGODB_URI (ou MONGO_URI) manquant dans .env");

  const client = new MongoClient(uri);
  await client.connect();

  const dbName = process.env.MONGODB_DB; // ex: ronnasite
  const db = dbName ? client.db(dbName) : client.db();

  const col = db.collection("quote_requests");

  const filter = {
    $or: [{ name: { $exists: true } }, { meta: { $exists: true } }],
  };

  const result = await col.updateMany(
    filter,
    [
      {
        $set: {
          fullName: { $ifNull: ["$fullName", "$name"] },
          company: { $ifNull: ["$company", "$meta.company"] },
          role: { $ifNull: ["$role", "$meta.role"] },
          service: { $ifNull: ["$service", "$meta.service"] },

          budgetRange: { $ifNull: ["$budgetRange", "$meta.budgetRange"] },
          timeline: { $ifNull: ["$timeline", "$meta.timeline"] },
          preferredContact: { $ifNull: ["$preferredContact", "$meta.preferredContact"] },

          consent: { $ifNull: ["$consent", "$meta.consent"] },
        },
      },
      { $unset: ["name", "meta"] },
    ]
    // 👈 PAS d'options bypassDocumentValidation
  );

  console.log("✅ Migration terminée");
  console.log("Matched:", result.matchedCount);
  console.log("Modified:", result.modifiedCount);

  await client.close();
}

main().catch((e) => {
  console.error("❌ Migration error:", e);
  process.exit(1);
});