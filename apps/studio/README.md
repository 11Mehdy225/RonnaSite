# Collecte vidéo Ronna Studio

Première collecte : `http://localhost:4173/rosee-de-l-hermon`.

## Parcours et stockage

1. Le navigateur demande une URL d’envoi temporaire au serveur.
2. La vidéo est transférée directement vers un bucket privé S3 compatible (Cloudflare R2 recommandé) avec progression visible.
3. Le serveur vérifie la présence et la taille du fichier dans le stockage.
4. Le message **« Vidéo reçue »** n’est renvoyé qu’après cette confirmation.
5. Un enregistrement JSON associé conserve le prénom, le sous-groupe, le nom d’origine et la date.

En local, le même parcours écrit dans `.local-storage/`. En production, aucune vidéo ne transite par le disque éphémère de Render.

## Lancer en local

```bash
cp apps/studio/.env.example apps/studio/.env
npm run dev:studio
```

Espace privé de récupération : `http://localhost:4173/admin.html`. La clé locale par défaut est `local-admin-token` si aucune variable n’est définie. Définir toujours une vraie clé sur Render.

## Ajouter un événement

Ajouter une entrée dans `config/events.mjs`, puis placer ses visuels dans `public/assets/`. Le slug devient automatiquement l’URL publique et le préfixe du stockage. La collecte de La Rosée de l’Hermon utilise l’affiche officielle, l’emblème et le visuel vertical du 18 décembre 2026.

## Cloudflare R2 (bucket privé)

Créer un bucket privé, une clé API lecture/écriture limitée à ce bucket, puis renseigner les variables `S3_*` de `.env.example` dans Render. CORS du bucket :

```json
[
  {
    "AllowedOrigins": ["https://ronnastudio.ronnagroup.net", "http://localhost:4173"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Le bucket reste privé. La page administrateur obtient des liens de téléchargement valables 15 minutes ; elle n’expose jamais les clés du stockage.

## Render

Le fichier `render.studio.yaml` contient le service prêt à créer. Lors de la création du Blueprint, utiliser ce fichier et saisir les quatre secrets S3. Render génère les deux secrets de signature et d’administration. Après le premier déploiement :

1. vérifier `/api/health` ;
2. ajouter `ronnastudio.ronnagroup.net` comme domaine personnalisé du service ;
3. recopier exactement la cible CNAME fournie par Render dans le DNS ;
4. attendre la validation TLS de Render, puis tester l’envoi réel.

## DNS

Créer l’enregistrement suivant chez le gestionnaire DNS de `ronnagroup.net` :

- Type : `CNAME`
- Nom : `ronnastudio`
- Cible : valeur fournie par Render dans **Settings → Custom Domains**
- TTL : automatique ou 300 secondes pendant la mise en place

Si Cloudflare gère le DNS, commencer en **DNS only** jusqu’à ce que le certificat Render soit actif, puis activer le proxy si souhaité.

## Récupérer les vidéos

Ouvrir `/admin.html`, saisir `ADMIN_ACCESS_TOKEN`, puis télécharger les fichiers. Ils sont aussi rangés dans le bucket sous :

```text
ronna-studio/<slug>/videos/<AAAA-MM-JJ>/<identifiant>.mp4|mov
ronna-studio/<slug>/records/<identifiant>.json
```

Les observateurs publics ne peuvent ni lister ni télécharger le contenu du bucket.
