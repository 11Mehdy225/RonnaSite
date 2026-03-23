import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import GalleryUploader from "../../components/admin/GalleryUploader.jsx";

const CTA_SECONDARY_TYPES = [
  { value: "CONTACT", label: "Contact (redirige vers /contact)" },
  { value: "LINK", label: "Lien (URL)" },
];

async function readJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function AdminProjectsForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const initial = useMemo(
    () => ({
      title: "",
      excerpt: "",
      category: "",
      coverImage: "",
      gallery: "", // textarea multi-lines -> array
      content: "",

      ctaPrimaryLabel: "Voir",
      ctaPrimaryUrl: "",
      ctaSecondaryLabel: "Nous écrire",
      ctaSecondaryType: "CONTACT",
      ctaSecondaryUrl: "",

      published: false,
    }),
    []
  );

  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // {type:'ok'|'err', text:''}

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setNotice(null);
  };

  // Helper API admin (cookie httpOnly)
  const api = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...(options.headers || {}),
          ...(options.body ? { "Content-Type": "application/json",
    "X-Requested-With": "rg-admin",} : null),
        },
      });

      if (res.status === 401) {
        nav("/admin/login", { replace: true });
        throw new Error("UNAUTHORIZED");
      }

      const json = await readJson(res);
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
      }

      return json;
    },
    [nav]
  );

  // Load en mode edit
  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotice(null);
      try {
        const json = await api(`/api/admin/projects/${id}`);
        const item = json.item || {};

        if (cancelled) return;

        setData({
          title: item.title || "",
          excerpt: item.excerpt || "",
          category: item.category || "",
          coverImage: item.coverImage || "",
          gallery: Array.isArray(item.gallery) ? item.gallery.join("\n") : "",
          content: item.content || "",

          ctaPrimaryLabel: item.ctaPrimaryLabel || "Voir",
          ctaPrimaryUrl: item.ctaPrimaryUrl || "",
          ctaSecondaryLabel: item.ctaSecondaryLabel || "Nous écrire",
          ctaSecondaryType: item.ctaSecondaryType || "CONTACT",
          ctaSecondaryUrl: item.ctaSecondaryUrl || "",

          published: Boolean(item.published),
        });
      } catch (e) {
        if (cancelled) return;
        if (e?.message === "UNAUTHORIZED") return;
        setNotice({ type: "err", text: e?.message || "Erreur réseau" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, api]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (saving) return;

    // validations légères
    if (data.title.trim().length < 3)
      return setNotice({ type: "err", text: "Titre requis (min 3)." });
    if (data.excerpt.trim().length < 10)
      return setNotice({ type: "err", text: "Résumé requis (min 10)." });
    if (data.content.trim().length < 10)
      return setNotice({ type: "err", text: "Contenu requis (min 10)." });

    setSaving(true);
    setNotice(null);

    const payload = {
      title: data.title.trim(),
      excerpt: data.excerpt.trim(),
      category: data.category.trim(),
      coverImage: data.coverImage.trim(),
      gallery: String(data.gallery || "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      content: data.content,

      ctaPrimaryLabel: data.ctaPrimaryLabel.trim() || "Voir",
      ctaPrimaryUrl: data.ctaPrimaryUrl.trim(),
      ctaSecondaryLabel: data.ctaSecondaryLabel.trim() || "Nous écrire",
      ctaSecondaryType: data.ctaSecondaryType,
      ctaSecondaryUrl: data.ctaSecondaryUrl.trim(),

      published: Boolean(data.published),
    };

    if (payload.ctaSecondaryType === "CONTACT") payload.ctaSecondaryUrl = "";

    try {
      const url = isEdit ? `/api/admin/projects/${id}` : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";

      const json = await api(url, {
        method,
        body: JSON.stringify(payload),
      });

      setNotice({
        type: "ok",
        text: isEdit ? "Mise à jour OK." : "Création OK.",
      });

      if (!json?.item?._id) {
  throw new Error("Création OK mais aucun item renvoyé par l’API (réponse inattendue).");
}

      // en create: redirection vers edit
      const newId = json?.item?._id;
      if (!isEdit && newId) {
        nav(`/admin/projects/${newId}/edit`, { replace: true });
      }
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") return;
      setNotice({
        type: "err",
        text: e?.message || "Erreur réseau. Vérifie que l’API tourne.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <div>
          <h1 style={styles.h1}>
            {isEdit ? "Modifier une réalisation" : "Nouvelle réalisation"}
          </h1>
          <div style={styles.sub}>
            Slug auto à partir du titre. Le site public n’affiche que{" "}
            <strong>Publié</strong>.
          </div>
        </div>

        <div style={styles.actions}>
          <Link to="/admin/projects" style={styles.btnGhost}>
            ← Retour liste
          </Link>
          <button
            type="submit"
            form="projectForm"
            style={styles.btn}
            disabled={saving || loading}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>

      {notice && (
        <div
          style={{
            ...styles.notice,
            ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr),
          }}
        >
          {notice.text}
        </div>
      )}

      <div style={styles.card}>
        {loading ? (
          <div style={styles.empty}>Chargement…</div>
        ) : (
          <form id="projectForm" onSubmit={onSubmit} style={styles.form}>
            <div className="_rg_admin_grid2" style={styles.grid2}>
              <Field
                label="Titre *"
                value={data.title}
                onChange={(v) => setField("title", v)}
              />
              <Field
                label="Catégorie (optionnel)"
                value={data.category}
                onChange={(v) => setField("category", v)}
              />
            </div>

            <TextArea
              label="Résumé (excerpt) *"
              value={data.excerpt}
              onChange={(v) => setField("excerpt", v)}
              rows={3}
              hint="Court résumé pour la carte de la liste."
            />

            <div className="_rg_admin_grid2" style={styles.grid2}>
              <ImageUploader
                label="Image principale"
                value={data.coverImage}
                onChange={(url) => setField("coverImage", url)}
              />

              <Field
                label="Image principale (URL)"
                value={data.coverImage}
                onChange={(v) => setField("coverImage", v)}
                placeholder="https://..."
              />

              <label style={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={data.published}
                  onChange={(e) => setField("published", e.target.checked)}
                />
                <span>Publié</span>
              </label>
            </div>

            <GalleryUploader
              label="Galerie"
              value={String(data.gallery || "")
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean)}
              onChange={(arr) => setField("gallery", arr.join("\n"))}
            />

            <TextArea
              label="Galerie (1 URL par ligne)"
              value={data.gallery}
              onChange={(v) => setField("gallery", v)}
              rows={4}
            />

            <TextArea
              label="Contenu (description longue) *"
              value={data.content}
              onChange={(v) => setField("content", v)}
              rows={10}
              hint="Pour l’instant texte/HTML simple. On branche TipTap juste après."
            />

            <div style={styles.sep} />

            <div style={styles.blockTitle}>CTA (boutons)</div>

            <div className="_rg_admin_grid2" style={styles.grid2}>
              <Field
                label="Bouton primaire - Label"
                value={data.ctaPrimaryLabel}
                onChange={(v) => setField("ctaPrimaryLabel", v)}
              />
              <Field
                label="Bouton primaire - URL (optionnel)"
                value={data.ctaPrimaryUrl}
                onChange={(v) => setField("ctaPrimaryUrl", v)}
                placeholder="https://..."
              />
            </div>

            <div className="_rg_admin_grid2" style={styles.grid2}>
              <Field
                label="Bouton secondaire - Label"
                value={data.ctaSecondaryLabel}
                onChange={(v) => setField("ctaSecondaryLabel", v)}
              />
              <Select
                label="Bouton secondaire - Type"
                value={data.ctaSecondaryType}
                onChange={(v) => setField("ctaSecondaryType", v)}
                options={CTA_SECONDARY_TYPES}
              />
            </div>

            {data.ctaSecondaryType === "LINK" && (
              <Field
                label="Bouton secondaire - URL"
                value={data.ctaSecondaryUrl}
                onChange={(v) => setField("ctaSecondaryUrl", v)}
                placeholder="https://..."
              />
            )}

            <div style={styles.bottomNote}>
              Astuce : si “Publié” est décoché, l’élément reste en brouillon et
              n’apparaît pas sur le site.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 6, hint }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        style={styles.textarea}
      />
      {hint && <div style={styles.hint}>{hint}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// styles: tu peux garder les tiens inchangés
const styles = {
  wrap: { maxWidth: 1100, margin: "0 auto" },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  h1: { margin: 0, fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)", maxWidth: 720 },

  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },

  btn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    textDecoration: "none",
  },

  notice: { marginTop: 12, borderRadius: 16, padding: "12px 12px", border: "1px solid rgba(255,255,255,0.12)" },
  noticeOk: { background: "rgba(34,197,94,0.10)", color: "rgba(255,255,255,0.92)" },
  noticeErr: { background: "rgba(239,68,68,0.10)", color: "rgba(255,255,255,0.92)" },

  card: { marginTop: 12, borderRadius: 20, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)", padding: 14 },

  form: { display: "grid", gap: 12 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },

  field: { display: "grid", gap: 6 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.70)" },

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
  hint: { fontSize: 12, color: "rgba(255,255,255,0.55)" },

  checkRow: {
    marginTop: 22,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.85)",
  },

  sep: { height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 0" },
  blockTitle: { fontWeight: 950, color: "rgba(255,255,255,0.90)" },
  bottomNote: { fontSize: 12, color: "rgba(255,255,255,0.60)" },

  empty: { padding: 14, color: "rgba(255,255,255,0.70)" },
};