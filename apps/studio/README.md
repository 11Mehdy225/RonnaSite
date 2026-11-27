# Collecte vidéo Ronna Studio

Première collecte : `http://localhost:4173/rosee-de-l-hermon`.

## Parcours et stockage

1. Le navigateur demande une autorisation d’envoi temporaire au serveur.
2. La vidéo est transférée directement vers un stockage privé Vercel Blob avec progression visible.
3. Le serveur vérifie la présence et la taille du fichier dans le stockage.
4. Le message **« Vidéo reçue »** n’est renvoyé qu’après cette confirmation.
5. Un enregistrement JSON associé conserve le prénom, le sous-groupe, le nom d’origine et la date.

En local, le même parcours écrit dans `.local-storage/`. En production, aucune vidéo ne transite par le disque éphémère d’une fonction Vercel.

## Lancer en local

```bash
cp apps/studio/.env.example apps/studio/.env
npm run dev:studio
```

Espace privé de récupération : `http://localhost:4173/admin.html`. La clé locale par défaut est `local-admin-token` si aucune variable n’est définie. Définir toujours une vraie clé sur Vercel.

## Ajouter un événement

Ajouter une entrée dans `config/events.mjs`, puis placer ses visuels dans `public/assets/`. Le slug devient automatiquement l’URL publique et le préfixe du stockage. La collecte de La Rosée de l’Hermon utilise l’affiche officielle, l’emblème et le visuel vertical du 18 décembre 2026.

## Vercel Blob privé

La collecte utilise Vercel Blob privé en production. Dans le projet Vercel Ronna Studio :

1. ouvrir **Storage** ;
2. choisir **Create Storage → Blob** ;
3. sélectionner l’accès **Private** ;
4. activer **Add a read-write token env var to this connection** pour autoriser les envois directs depuis le navigateur ;
5. connecter le stockage aux environnements Production et Preview.

Vercel ajoute automatiquement `BLOB_STORE_ID` et `BLOB_READ_WRITE_TOKEN`. Les vidéos restent privées et leur lecture passe par la route administrateur protégée.

## Déploiement Vercel

Créer un second projet depuis le dépôt `11Mehdy225/RonnaSite` et choisir `apps/studio` comme **Root Directory**. Vercel détecte Express et utilise `apps/studio/vercel.json`.

Variables à ajouter au projet :

- `STORAGE_MODE=vercel-blob`
- `PUBLIC_BASE_URL=https://ronnastudio.ronnagroup.net`
- `UPLOAD_SIGNING_SECRET` avec une valeur longue et aléatoire
- `ADMIN_ACCESS_TOKEN` avec une valeur longue et aléatoire

Après le premier déploiement, connecter le Blob privé puis redéployer. Vérifier ensuite `/api/health` avant un envoi réel.

## DNS

Ajouter `ronnastudio.ronnagroup.net` dans **Project Settings → Domains**. Comme le domaine principal est déjà géré par Vercel, Vercel peut généralement créer ou reconnaître automatiquement l’enregistrement. Sinon, utiliser la valeur DNS affichée par Vercel :

- Type : `CNAME`
- Nom : `ronnastudio`
- Cible : valeur fournie par Vercel dans **Project Settings → Domains**
- TTL : automatique ou 300 secondes pendant la mise en place

Attendre la validation du domaine et du certificat TLS avant de partager le lien.

## Récupérer les vidéos

Ouvrir `/admin.html`, saisir `ADMIN_ACCESS_TOKEN`, puis télécharger les fichiers. Ils sont aussi rangés dans le bucket sous :

```text
ronna-studio/<slug>/videos/<AAAA-MM-JJ>/<identifiant>.mp4|mov
ronna-studio/<slug>/records/<identifiant>.json
```

Les visiteurs publics ne peuvent ni lister ni télécharger le contenu du stockage privé.
