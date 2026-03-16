import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

function slugify(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "ronnasite";

  if (!uri) throw new Error("❌ MONGODB_URI manquant dans .env");

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  const db = client.db(dbName);

  const now = new Date();

  // ⚠️ Mets ici tes vraies URLs d'images (Option 1)
  const seed = [
    {
      title: "Lancement officiel de RONNA GROUP",
      excerpt:
        "Ronna Group structure ses pôles et annonce ses premières offres autour du digital, du développement et de l’innovation.",
      content:
        "Contenu long placeholder. Ici tu écriras l’article complet : contexte, objectifs, retombées, prochaines étapes.\n\nTu peux ajouter plusieurs paragraphes.",
      category: "COMMUNIQUE",
      coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-01-05T10:00:00.000Z")
    },
    {
      title: "RONNA TV : nouvelle ligne éditoriale",
      excerpt:
        "Capsules, formats courts et contenus de valeur pour mettre en avant la tech, l’innovation et les talents.",
      content:
        "Contenu long placeholder RONNA TV. Thématiques, formats, calendrier, objectifs, diffusion multi-plateformes.",
      category: "MEDIA",
      coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-01-03T09:30:00.000Z")
    },
    {
      title: "Un nouveau projet web en préparation",
      excerpt:
        "Conception d’une plateforme institutionnelle avec une approche moderne : performance, sécurité et expérience utilisateur.",
      content:
        "Contenu long placeholder projet web. Objectifs, fonctionnalités, timeline, méthodologie et livrables.",
      category: "PROJET",
      coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-01-02T15:15:00.000Z")
    },
    {
      title: "Participation à un événement tech local",
      excerpt:
        "Échanges, réseau et veille technologique autour des solutions numériques adaptées aux réalités africaines.",
      content:
        "Contenu long placeholder événement. Résumé, photos, enseignements, prochaines collaborations.",
      category: "EVENEMENT",
      coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2025-12-20T18:00:00.000Z")
    },
    {
      title: "La Fondation : premières actions envisagées",
      excerpt:
        "Ronna Group prépare des initiatives orientées impact : éducation, inclusion et soutien communautaire.",
      content:
        "Contenu long placeholder fondation. Piliers, actions, calendrier, partenaires possibles et indicateurs d’impact.",
      category: "FONDATION",
      coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2025-12-15T11:00:00.000Z")
    }
  ];

  // Prépare documents : slug + timestamps
  const docs = seed.map((x) => {
    const slugBase = slugify(x.title);
    return {
      ...x,
      slug: slugBase,
      createdAt: now,
      updatedAt: now
    };
  });

  // Évite les collisions de slug (si tu relances le seed)
  // Stratégie : si slug existe déjà, on ajoute -2 -3 etc.
  const col = db.collection("news");
  for (const doc of docs) {
    let slug = doc.slug;
    let i = 2;
    while (await col.findOne({ slug })) {
      slug = `${doc.slug}-${i++}`;
    }
    doc.slug = slug;
  }

  // Insert
  const result = await col.insertMany(docs);
  console.log(`✅ Seed terminé: ${result.insertedCount} news insérées dans ${dbName}.news`);

  await client.close();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
