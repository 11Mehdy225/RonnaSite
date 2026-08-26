import { GridFSBucket, ObjectId } from "mongodb";

const MEDIA_URL_RE = /^\/api\/media\/([a-f\d]{24})(?:[/?#].*)?$/i;

function uniqueMediaUrls(values) {
  return [...new Set(values.flat().filter((value) => MEDIA_URL_RE.test(String(value || "").trim())))];
}

async function isMediaReferenced(db, url) {
  const [news, project, foundation] = await Promise.all([
    db.collection("news").findOne({ coverImage: url }, { projection: { _id: 1 } }),
    db.collection("projects").findOne(
      { $or: [{ coverImage: url }, { gallery: url }] },
      { projection: { _id: 1 } }
    ),
    db.collection("foundation_actions").findOne({ image: url }, { projection: { _id: 1 } }),
  ]);

  return Boolean(news || project || foundation);
}

export async function deleteUnreferencedMedia(db, values) {
  const urls = uniqueMediaUrls(values);
  if (!urls.length) return;

  const bucket = new GridFSBucket(db, { bucketName: "media" });

  for (const url of urls) {
    if (await isMediaReferenced(db, url)) continue;

    const match = url.match(MEDIA_URL_RE);
    try {
      await bucket.delete(new ObjectId(match[1]));
    } catch (error) {
      // Le fichier peut déjà avoir été retiré manuellement. La suppression du
      // contenu ne doit pas échouer pour un média absent.
      if (error?.code !== "ENOENT" && !/File not found/i.test(error?.message || "")) {
        console.error(`Suppression média ${url} échouée:`, error);
      }
    }
  }
}
