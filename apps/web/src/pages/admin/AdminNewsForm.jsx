// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import LinkExt from "@tiptap/extension-link";
// import ImageExt from "@tiptap/extension-image";
// import Placeholder from "@tiptap/extension-placeholder";
// import ImageUploader from "../../components/admin/ImageUploader.jsx";

// const CATEGORY_OPTIONS = [
//   { value: "COMMUNIQUE", label: "Communiqué" },
//   { value: "MEDIA", label: "Média" },
//   { value: "EVENEMENT", label: "Événement" },
//   { value: "PROJET", label: "Projet" },
// ];

// export default function AdminNewsForm({ mode = "create" }) {
//   const nav = useNavigate();
//   const token = localStorage.getItem("rg_admin_token");
//   const { id } = useParams();

//   const isEdit = mode === "edit";
//   const [loading, setLoading] = useState(isEdit); // en edit: on charge
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState(null);
//   const [notice, setNotice] = useState(null);

//   // Champs "méta"
//   const [title, setTitle] = useState("");
//   const [excerpt, setExcerpt] = useState("");
//   const [category, setCategory] = useState("COMMUNIQUE");
//   const [coverImage, setCoverImage] = useState("");
//   const [published, setPublished] = useState(false);

//   // Editor TipTap
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       LinkExt.configure({
//         openOnClick: false,
//         autolink: true,
//         linkOnPaste: true,
//       }),
//       ImageExt.configure({
//         inline: false,
//         allowBase64: true,
//       }),
//       Placeholder.configure({
//         placeholder: "Écris ton article ici…",
//       }),
//     ],
//     content: "",
//     editorProps: {
//       attributes: {
//         style:
//           "min-height:260px; outline:none; padding:12px; border-radius:14px; border:1px solid rgba(255,255,255,0.12); background: rgba(3,10,26,0.35); color: rgba(255,255,255,0.92);",
//       },
//     },
//   });

//   const canSubmit = useMemo(() => {
//     const html = editor?.getHTML?.() || "";
//     return (
//       title.trim().length >= 3 &&
//       excerpt.trim().length >= 10 &&
//       stripHtml(html).trim().length >= 20
//     );
//   }, [title, excerpt, editor]);

//   // Load en mode edit
//   useEffect(() => {
//     if (!isEdit) return;

//     let alive = true;
//     const load = async () => {
//       setLoading(true);
//       setErr(null);
//       try {
//         const res = await fetch(`/api/admin/news?limit=1&page=1&id=${id}`, {
//           // on ne l'utilise pas au backend, donc on va plutôt fetch par "public get by id"
//           // Mais admin doit voir même DRAFT. => on va faire GET /api/admin/news puis filtrer côté front si besoin.
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // ⚠️ Ton backend n'a pas encore GET /api/admin/news/:id.
//         // Donc on fait: GET /api/admin/news (limit large) et on trouve l'item.
//         const json = await res.json().catch(() => ({}));
//         if (!res.ok || json?.ok !== true) {
//           throw new Error(
//             json?.message || "Impossible de charger l'actualité.",
//           );
//         }

//         const found = (json.items || []).find((x) => x._id === id);
//         if (!found) throw new Error("Actualité introuvable.");

//         if (!alive) return;

//         setTitle(found.title || "");
//         setExcerpt(found.excerpt || "");
//         setCategory(found.category || "COMMUNIQUE");
//         setCoverImage(found.coverImage || "");
//         setPublished(Boolean(found.published));

//         // Ici on a besoin du contenu complet.
//         // Ton endpoint /api/admin/news projette pas "content" (normal). Donc on fait un fetch public par id
//         // MAIS public refuse si published=false. => pour l'edit DRAFT, il faut un endpoint admin GET by id.
//         // En attendant, si ton item est PUBLISHED, on peut lire via /api/news/:id.
//         if (found.published) {
//           const r2 = await fetch(`/api/news/${found._id}`);
//           const j2 = await r2.json().catch(() => ({}));
//           if (r2.ok && j2?.ok && j2?.item?.content) {
//             editor?.commands?.setContent(j2.item.content || "");
//           }
//         } else {
//           // fallback: vide (jusqu'à ce qu'on ajoute GET /api/admin/news/:id)
//           editor?.commands?.setContent("");
//         }

//         setNotice(null);
//       } catch (e) {
//         console.error(e);
//         if (!alive) return;
//         setErr(e?.message || "Erreur de chargement.");
//       } finally {
//         if (!alive)
//           // return;
//           setLoading(false);
//       }
//     };

//     load();
//     return () => {
//       alive = false;
//     };
//   }, [isEdit, id, token, editor]);

//   const save = async ({ publish }) => {
//     if (saving) return;
//     setErr(null);
//     setNotice(null);

//     const html = editor?.getHTML?.() || "";

//     // Validation front
//     if (title.trim().length < 3)
//       return setErr("Titre requis (min 3 caractères).");
//     if (excerpt.trim().length < 10)
//       return setErr("Résumé requis (min 10 caractères).");
//     if (stripHtml(html).trim().length < 20)
//       return setErr("Contenu requis (min 20 caractères).");

//     setSaving(true);
//     try {
//       const payload = {
//         title: title.trim(),
//         excerpt: excerpt.trim(),
//         content: html,
//         category,
//         coverImage: coverImage.trim(),
//         published: Boolean(publish),
//       };

//       const res = await fetch(
//         isEdit ? `/api/admin/news/${id}` : "/api/admin/news",
//         {
//           method: isEdit ? "PATCH" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const json = await res.json().catch(() => ({}));
//       if (!res.ok || json?.ok !== true) {
//         throw new Error(json?.message || "Échec de sauvegarde.");
//       }

//       setNotice(publish ? "Publié ✅" : "Enregistré en brouillon ✅");

//       // Redirection logique
//       if (!isEdit) {
//         nav(`/admin/news/${json.item._id}/edit`, { replace: true });
//       }
//     } catch (e) {
//       console.error(e);
//       setErr(e?.message || "Erreur serveur.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const remove = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm("Supprimer définitivement cette actualité ?");
//     if (!ok) return;

//     setSaving(true);
//     setErr(null);
//     setNotice(null);

//     try {
//       const res = await fetch(`/api/admin/news/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const json = await res.json().catch(() => ({}));
//       if (!res.ok || json?.ok !== true)
//         throw new Error(json?.message || "Suppression impossible.");

//       nav("/admin/news", { replace: true });
//     } catch (e) {
//       console.error(e);
//       setErr(e?.message || "Erreur serveur.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Toolbar actions
//   const addLink = () => {
//     const url = window.prompt("Lien URL (https://...)");
//     if (!url) return;
//     editor
//       ?.chain()
//       .focus()
//       .extendMarkRange("link")
//       .setLink({ href: url })
//       .run();
//   };

//   const addImage = () => {
//     const url = window.prompt("URL de l'image (https://...)");
//     if (!url) return;
//     editor?.chain().focus().setImage({ src: url }).run();
//   };

//   return (
//     <div style={styles.wrap}>
//       <div style={styles.top}>
//         <div>
//           <div style={styles.h1}>
//             {isEdit ? "Éditer une actualité" : "Nouvelle actualité"}
//           </div>
//           <div style={styles.sub}>
//             <Link to="/admin/news" style={styles.backLink}>
//               ← Retour à la liste
//             </Link>
//           </div>
//         </div>

//         <div style={styles.actions}>
//           {isEdit && (
//             <button
//               type="button"
//               style={styles.btnDanger}
//               onClick={remove}
//               disabled={saving}
//             >
//               Supprimer
//             </button>
//           )}
//           <button
//             type="button"
//             style={styles.btnGhost}
//             onClick={() => save({ publish: false })}
//             disabled={saving || loading}
//           >
//             {saving ? "..." : "Enregistrer brouillon"}
//           </button>
//           <button
//             type="button"
//             style={styles.btn}
//             onClick={() => save({ publish: true })}
//             disabled={saving || loading}
//           >
//             {saving ? "..." : "Publier"}
//           </button>
//         </div>
//       </div>

//       {loading && <div style={styles.state}>Chargement…</div>}
//       {!loading && err && (
//         <div style={{ ...styles.state, ...styles.stateErr }}>{err}</div>
//       )}
//       {!loading && notice && (
//         <div style={{ ...styles.state, ...styles.stateOk }}>{notice}</div>
//       )}

//       {!loading && (
//         <div style={styles.grid}>
//           {/* Colonne gauche : meta */}
//           <div style={styles.card}>
//             <div style={styles.sectionTitle}>Infos</div>

//             <Field
//               label="Titre *"
//               value={title}
//               onChange={setTitle}
//               placeholder="Ex: Lancement officiel de RONNA GROUP"
//             />
//             <TextArea
//               label="Résumé *"
//               value={excerpt}
//               onChange={setExcerpt}
//               rows={4}
//               placeholder="Résumé court affiché en liste…"
//             />

//             <label style={styles.label}>Catégorie</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               style={styles.input}
//             >
//               {CATEGORY_OPTIONS.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//             <ImageUploader
//               label="Image de couverture"
//               value={coverImage}
//               onChange={setCoverImage}
//             />
//             <Field
//               label="Cover image (URL)"
//               value={coverImage}
//               onChange={setCoverImage}
//               placeholder="https://..."
//             />

//             <label style={styles.toggleRow}>
//               <input
//                 type="checkbox"
//                 checked={published}
//                 onChange={(e) => setPublished(e.target.checked)}
//               />
//               <span>Marquer comme publié (état local)</span>
//             </label>

//             <div style={styles.hint}>
//               Le bouton <strong>Publier</strong> envoie{" "}
//               <code>published=true</code> au backend. Le slug est généré
//               automatiquement.
//             </div>
//           </div>

//           {/* Colonne droite : editor */}
//           <div style={styles.card}>
//             <div style={styles.sectionTitle}>Contenu *</div>

//             <div style={styles.toolbar}>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() => editor?.chain().focus().toggleBold().run()}
//               >
//                 Bold
//               </button>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() => editor?.chain().focus().toggleItalic().run()}
//               >
//                 Italic
//               </button>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() => editor?.chain().focus().toggleBulletList().run()}
//               >
//                 • Liste
//               </button>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() =>
//                   editor?.chain().focus().toggleOrderedList().run()
//                 }
//               >
//                 1. Liste
//               </button>
//               <button type="button" style={styles.tbBtn} onClick={addLink}>
//                 Lien
//               </button>
//               <button type="button" style={styles.tbBtn} onClick={addImage}>
//                 Image
//               </button>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() => editor?.chain().focus().setParagraph().run()}
//               >
//                 P
//               </button>
//               <button
//                 type="button"
//                 style={styles.tbBtn}
//                 onClick={() =>
//                   editor?.chain().focus().toggleHeading({ level: 2 }).run()
//                 }
//               >
//                 H2
//               </button>
//             </div>

//             <EditorContent editor={editor} />

//             <div style={styles.editorHint}>
//               Astuce: pour insérer une image, colle une URL. (Upload viendra
//               plus tard.)
//             </div>

//             {!canSubmit && (
//               <div style={styles.warn}>
//                 ⚠️ Remplis Titre (≥ 3), Résumé (≥ 10) et Contenu (≥ 20) avant
//                 publication.
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Field({ label, value, onChange, placeholder }) {
//   return (
//     <div style={styles.field}>
//       <div style={styles.label}>{label}</div>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         style={styles.input}
//       />
//     </div>
//   );
// }

// function TextArea({ label, value, onChange, rows = 5, placeholder }) {
//   return (
//     <div style={styles.field}>
//       <div style={styles.label}>{label}</div>
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         rows={rows}
//         placeholder={placeholder}
//         style={styles.textarea}
//       />
//     </div>
//   );
// }

// function stripHtml(html) {
//   return String(html || "").replace(/<[^>]*>/g, " ");
// }

// const styles = {
//   wrap: { maxWidth: 1200, margin: "0 auto" },
//   top: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   h1: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
//   sub: { marginTop: 6 },
//   backLink: { color: "rgba(255,255,255,0.72)", textDecoration: "none" },

//   actions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

//   grid: {
//     marginTop: 14,
//     display: "grid",
//     gridTemplateColumns: "420px 1fr",
//     gap: 14,
//   },

//   card: {
//     borderRadius: 20,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 14,
//   },

//   sectionTitle: {
//     fontWeight: 950,
//     color: "rgba(255,255,255,0.90)",
//     marginBottom: 10,
//   },

//   field: { display: "grid", gap: 6, marginBottom: 10 },
//   label: { fontSize: 12, color: "rgba(255,255,255,0.72)" },

//   input: {
//     width: "100%",
//     padding: "12px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: "rgba(3,10,26,0.35)",
//     color: "rgba(255,255,255,0.92)",
//     outline: "none",
//   },
//   textarea: {
//     width: "100%",
//     padding: "12px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: "rgba(3,10,26,0.35)",
//     color: "rgba(255,255,255,0.92)",
//     outline: "none",
//     resize: "vertical",
//   },

//   toolbar: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },
//   tbBtn: {
//     padding: "8px 10px",
//     borderRadius: 12,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.86)",
//     cursor: "pointer",
//   },

//   editorHint: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.60)" },
//   hint: {
//     marginTop: 10,
//     fontSize: 12,
//     color: "rgba(255,255,255,0.62)",
//     lineHeight: 1.6,
//   },
//   warn: {
//     marginTop: 12,
//     padding: "10px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(245,158,11,0.30)",
//     background: "rgba(245,158,11,0.10)",
//     color: "rgba(255,255,255,0.88)",
//   },

//   btn: {
//     padding: "10px 14px",
//     borderRadius: 999,
//     background: "rgba(31,79,216,.95)",
//     border: "1px solid rgba(255,255,255,0.14)",
//     color: "white",
//     cursor: "pointer",
//   },
//   btnGhost: {
//     padding: "10px 12px",
//     borderRadius: 999,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.88)",
//     cursor: "pointer",
//   },
//   btnDanger: {
//     padding: "10px 12px",
//     borderRadius: 999,
//     background: "rgba(239,68,68,0.14)",
//     border: "1px solid rgba(239,68,68,0.30)",
//     color: "rgba(255,255,255,0.92)",
//     cursor: "pointer",
//   },

//   state: {
//     marginTop: 12,
//     borderRadius: 18,
//     border: "1px dashed rgba(255,255,255,0.16)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 14,
//     color: "rgba(255,255,255,0.74)",
//   },
//   stateErr: {
//     borderColor: "rgba(239,68,68,0.35)",
//     color: "rgba(239,68,68,0.92)",
//   },
//   stateOk: {
//     borderColor: "rgba(34,197,94,0.35)",
//     color: "rgba(255,255,255,0.90)",
//   },

//   toggleRow: {
//     marginTop: 6,
//     display: "flex",
//     gap: 10,
//     color: "rgba(255,255,255,0.76)",
//   },
// };

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import { deleteNews } from "../../lib/adminApi.js";

const CATEGORY_OPTIONS = [
  { value: "COMMUNIQUE", label: "Communiqué" },
  { value: "MEDIA", label: "Média" },
  { value: "EVENEMENT", label: "Événement" },
  { value: "PROJET", label: "Projet" },
];

export default function AdminNewsForm({ mode = "create" }) {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [notice, setNotice] = useState(null);

  // Meta
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("COMMUNIQUE");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);

  // TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      ImageExt.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Écris ton article ici…",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        style:
          "min-height:260px; outline:none; padding:12px; border-radius:14px; border:1px solid rgba(255,255,255,0.12); background: rgba(3,10,26,0.35); color: rgba(255,255,255,0.92);",
      },
    },
  });

  const canSubmit = useMemo(() => {
    const html = editor?.getHTML?.() || "";
    return (
      title.trim().length >= 3 &&
      excerpt.trim().length >= 10 &&
      stripHtml(html).trim().length >= 20
    );
  }, [title, excerpt, editor]);

  // ✅ Load en edit via endpoint admin /:id
  useEffect(() => {
    if (!isEdit) return;
    if (!id) return;

    let alive = true;

 const load = async () => {
  setLoading(true);
  setErr(null);
  setNotice(null);

  try {
    const res = await fetch(`/api/admin/news/${id}`, {
      credentials: "include",
    });

    if (res.status === 401) {
      nav("/admin/login", { replace: true });
      return;
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok !== true || !json?.item) {
      throw new Error(json?.message || "Impossible de charger l'actualité.");
    }

    if (!alive) return;

    const item = json.item;

    setTitle(item.title || "");
    setExcerpt(item.excerpt || "");
    setCategory(item.category || "COMMUNIQUE");
    setCoverImage(item.coverImage || "");
    setPublished(Boolean(item.published));

    editor?.commands?.setContent(item.content || "");
  } catch (e) {
    if (!alive) return;
    console.error(e);
    setErr(e?.message || "Erreur de chargement.");
  } finally {
    if (!alive) 
    setLoading(false);
  }
};

    // TipTap peut être null au 1er render
    if (editor) load();

    return () => {
      alive = false;
    };
  }, [isEdit, id, editor, nav]);

  const save = async ({ publish }) => {
    if (saving) return;
    setErr(null);
    setNotice(null);

    const html = editor?.getHTML?.() || "";

    if (title.trim().length < 3) return setErr("Titre requis (min 3 caractères).");
    if (excerpt.trim().length < 10) return setErr("Résumé requis (min 10 caractères).");
    if (stripHtml(html).trim().length < 20) return setErr("Contenu requis (min 20 caractères).");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: html,
        category,
        coverImage: coverImage.trim(),
        published: Boolean(publish),
      };

      const res = await fetch(isEdit ? `/api/admin/news/${id}` : "/api/admin/news", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json",
    "X-Requested-With": "rg-admin", },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        nav("/admin/login", { replace: true });
        return;
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        throw new Error(json?.message || "Échec de sauvegarde.");
      }

      setNotice(publish ? "Publié ✅" : "Enregistré en brouillon ✅");

      if (!isEdit && json?.item?._id) {
        nav(`/admin/news/${json.item._id}/edit`, { replace: true });
      }
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Erreur serveur.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
  if (!isEdit) return;
  if (!window.confirm("Supprimer définitivement cette actualité ?")) return;

  setSaving(true);
  setErr(null);
  setNotice(null);

  try {
    await deleteNews(id);
    nav("/admin/news", { replace: true });
  } catch (e) {
    setErr(e?.message || "Erreur suppression.");
  } finally {
    setSaving(false);
  }
};

  // Toolbar
  const addLink = () => {
    const url = window.prompt("Lien URL (https://...)");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image (https://...)");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <div>
          <div style={styles.h1}>{isEdit ? "Éditer une actualité" : "Nouvelle actualité"}</div>
          <div style={styles.sub}>
            <Link to="/admin/news" style={styles.backLink}>← Retour à la liste</Link>
          </div>
        </div>

        <div style={styles.actions}>
          {isEdit && (
            <button type="button" style={styles.btnDanger} onClick={remove} disabled={saving}>
              Supprimer
            </button>
          )}
          <button
            type="button"
            style={styles.btnGhost}
            onClick={() => save({ publish: false })}
            disabled={saving || loading}
          >
            {saving ? "..." : "Enregistrer brouillon"}
          </button>
          <button
            type="button"
            style={styles.btn}
            onClick={() => save({ publish: true })}
            disabled={saving || loading || !canSubmit}
            title={!canSubmit ? "Remplis Titre/Résumé/Contenu" : ""}
          >
            {saving ? "..." : "Publier"}
          </button>
        </div>
      </div>

      {loading && <div style={styles.state}>Chargement…</div>}
      {!loading && err && <div style={{ ...styles.state, ...styles.stateErr }}>{err}</div>}
      {!loading && notice && <div style={{ ...styles.state, ...styles.stateOk }}>{notice}</div>}

      {!loading && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Infos</div>

            <Field label="Titre *" value={title} onChange={setTitle} placeholder="Ex: Lancement officiel de RONNA GROUP" />
            <TextArea
              label="Résumé *"
              value={excerpt}
              onChange={setExcerpt}
              rows={4}
              placeholder="Résumé court affiché en liste…"
            />

            <label style={styles.label}>Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <ImageUploader label="Image de couverture" value={coverImage} onChange={setCoverImage} />

            <Field label="Cover image (URL)" value={coverImage} onChange={setCoverImage} placeholder="https://..." />

            <label style={styles.toggleRow}>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span>État local publié</span>
            </label>

            <div style={styles.hint}>
              Le bouton <strong>Publier</strong> envoie <code>published=true</code> au backend.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Contenu *</div>

            <div style={styles.toolbar}>
              <button type="button" style={styles.tbBtn} onClick={() => editor?.chain().focus().toggleBold().run()}>
                Bold
              </button>
              <button type="button" style={styles.tbBtn} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                Italic
              </button>
              <button type="button" style={styles.tbBtn} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                • Liste
              </button>
              <button type="button" style={styles.tbBtn} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                1. Liste
              </button>
              <button type="button" style={styles.tbBtn} onClick={addLink}>Lien</button>
              <button type="button" style={styles.tbBtn} onClick={addImage}>Image</button>
              <button type="button" style={styles.tbBtn} onClick={() => editor?.chain().focus().setParagraph().run()}>
                P
              </button>
              <button
                type="button"
                style={styles.tbBtn}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </button>
            </div>

            <EditorContent editor={editor} />

            <div style={styles.editorHint}>
              Astuce: colle une URL pour insérer une image (upload via ImageUploader).
            </div>

            {!canSubmit && (
              <div style={styles.warn}>
                ⚠️ Remplis Titre (≥ 3), Résumé (≥ 10) et Contenu (≥ 20) avant publication.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={styles.input} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={styles.textarea}
      />
    </div>
  );
}

function stripHtml(html) {
  return String(html || "").replace(/<[^>]*>/g, " ");
}

const styles = {
  wrap: { maxWidth: 1200, margin: "0 auto" },
  top: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h1: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6 },
  backLink: { color: "rgba(255,255,255,0.72)", textDecoration: "none" },

  actions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

  grid: { marginTop: 14, display: "grid", gridTemplateColumns: "420px 1fr", gap: 14 },

  card: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
  },

  sectionTitle: { fontWeight: 950, color: "rgba(255,255,255,0.90)", marginBottom: 10 },

  field: { display: "grid", gap: 6, marginBottom: 10 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.72)" },

  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical",
  },

  toolbar: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },
  tbBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.86)",
    cursor: "pointer",
  },

  editorHint: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.60)" },
  hint: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 },
  warn: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(245,158,11,0.30)",
    background: "rgba(245,158,11,0.10)",
    color: "rgba(255,255,255,0.88)",
  },

  btn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
  },
  btnDanger: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.30)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },

  state: {
    marginTop: 12,
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
    color: "rgba(255,255,255,0.74)",
  },
  stateErr: { borderColor: "rgba(239,68,68,0.35)", color: "rgba(239,68,68,0.92)" },
  stateOk: { borderColor: "rgba(34,197,94,0.35)", color: "rgba(255,255,255,0.90)" },

  toggleRow: { marginTop: 6, display: "flex", gap: 10, color: "rgba(255,255,255,0.76)" },
};
