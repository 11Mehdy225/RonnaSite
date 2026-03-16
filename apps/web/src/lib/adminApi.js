const CSRF_HEADER_NAME = "X-Requested-With";
const CSRF_HEADER_VALUE = "rg-admin";

async function adminFetch(url, opts = {}) {
  const method = String(opts.method || "GET").toUpperCase();
  const headers = new Headers(opts.headers || {});

  

  // Cookie httpOnly -> indispensable
  const nextOpts = {
    ...opts,
    headers,
    credentials: "include",
  };

  // Anti-CSRF (simple): on l’envoie sur les requêtes mutantes
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers.set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE);
  }

  return fetch(url, nextOpts);
}
export async function deleteNews(id) {
  const res = await adminFetch(`/api/admin/news/${id}`, { method: "DELETE" });
  const json = await readJson(res);
  ensureOk(res, json, "Suppression impossible.");
  return true;
}

async function readJson(res) {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function ensureOk(res, json, fallback = "Erreur API") {
  if (res.ok && json?.ok === true) return;
  const msg = json?.message || json?.error || fallback;
  throw new Error(msg);
}

/* ─────────────────────────────────────────────
   Upload
───────────────────────────────────────────── */
export async function adminUploadFile(file) {
  if (!file) throw new Error("Fichier manquant.");

  const fd = new FormData();
  fd.append("file", file);

  const res = await adminFetch("/api/admin/upload", {
    method: "POST",
    body: fd,
  });

  const json = await readJson(res);
  if (!res.ok || json?.ok !== true || !json?.url) {
    throw new Error(json?.message || "Upload échoué");
  }

  return json.url; // "/uploads/xxx.jpg"
}

/* ─────────────────────────────────────────────
   Auth
───────────────────────────────────────────── */
export async function adminLogout() {
  await adminFetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
}

export async function adminMe() {
  const res = await adminFetch("/api/admin/auth/me");
  const json = await readJson(res);
  if (!res.ok || json?.ok !== true) return null;
  return json.user;
}


export { adminFetch };