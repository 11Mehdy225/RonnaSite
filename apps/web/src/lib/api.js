export function apiUrl(path) {
  // Le frontend et l'API sont déployés dans le même projet Vercel.
  // Une URL relative évite CORS et fonctionne aussi sur les previews.
  return path;
}
