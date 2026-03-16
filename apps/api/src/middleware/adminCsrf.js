export function requireAdminCsrf(req, res, next) {
  // On ne protège que les méthodes mutantes
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return next();

  // Header “AJAX only” attendu
  const marker = req.get("X-Requested-With");
  if (marker !== "rg-admin") {
    return res.status(403).json({ ok: false, message: "CSRF blocked" });
  }

  return next();
}