export async function adminFetch(path, options = {}) {
  const token = localStorage.getItem("rg_admin_token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(path, { ...options, headers });

  // si token expiré / absent -> on force retour login
  if (res.status === 401) {
    localStorage.removeItem("rg_admin_token");
    localStorage.removeItem("rg_admin_role");
    window.location.href = "/admin/login";
    throw new Error("Non autorisé (401)");
  }

  return res;
}