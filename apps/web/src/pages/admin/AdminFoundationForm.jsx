// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// function authHeaders() {
//   const token = localStorage.getItem("rg_admin_token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// function toInputDate(iso) {
//   if (!iso) return "";
//   try {
//     const d = new Date(iso);
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${day}`;
//   } catch {
//     return "";
//   }
// }

// export default function AdminFoundationForm({ mode = "create" }) {
//   const nav = useNavigate();
//   const { id } = useParams();

//   const [loading, setLoading] = useState(mode === "edit");
//   const [saving, setSaving] = useState(false);
//   const [notice, setNotice] = useState(null);
//   const [errors, setErrors] = useState({});

//   const initial = useMemo(
//     () => ({
//       title: "",
//       slug: "",
//       short: "",
//       details: "",
//       image: "",
//       eventDate: "",
//       order: 0,
//       published: false
//     }),
//     []
//   );

//   const [data, setData] = useState(initial);

//   const setField = (name, value) => {
//     setData((d) => ({ ...d, [name]: value }));
//     setErrors((e) => ({ ...e, [name]: undefined }));
//     setNotice(null);
//   };

//   useEffect(() => {
//     if (mode !== "edit") return;
//     let cancelled = false;

//     async function load() {
//       setLoading(true);
//       setNotice(null);
//       try {
//         const res = await fetch(`/api/admin/foundation/actions/${id}`, { headers: { ...authHeaders() } });
//         const json = await res.json().catch(() => ({}));
//         if (!res.ok || json?.ok === false) throw new Error(json?.message || "Erreur chargement");

//         const it = json.item || {};
//         if (!cancelled) {
//           setData({
//             title: it.title || "",
//             slug: it.slug || "",
//             short: it.short || "",
//             details: it.details || "",
//             image: it.image || "",
//             eventDate: toInputDate(it.eventDate),
//             order: typeof it.order === "number" ? it.order : 0,
//             published: it.published === true
//           });
//         }
//       } catch (e) {
//         if (!cancelled) setNotice({ type: "err", text: e?.message || "Erreur réseau" });
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [mode, id]);

//   const save = async () => {
//     if (saving) return;
//     setSaving(true);
//     setNotice(null);
//     setErrors({});

//     try {
//       const payload = {
//         title: data.title,
//         slug: data.slug,
//         short: data.short,
//         details: data.details,
//         image: data.image,
//         eventDate: data.eventDate, // "YYYY-MM-DD"
//         order: Number(data.order || 0),
//         published: data.published === true
//       };

//       const url =
//         mode === "edit"
//           ? `/api/admin/foundation/actions/${id}`
//           : `/api/admin/foundation/actions`;

//       const method = mode === "edit" ? "PATCH" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify(payload)
//       });

//       const json = await res.json().catch(() => ({}));

//       if (!res.ok || json?.ok === false) {
//         if (json?.errors) setErrors(json.errors);
//         throw new Error(json?.message || "Échec");
//       }

//       setNotice({ type: "ok", text: "Enregistré." });
//       nav("/admin/foundation", { replace: true });
//     } catch (e) {
//       setNotice({ type: "err", text: e?.message || "Erreur réseau" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.topRow}>
//         <div>
//           <h1 style={styles.h1}>{mode === "edit" ? "Modifier" : "Nouvelle action/événement"}</h1>
//           <div style={styles.sub}>
//             Mets une <strong>eventDate</strong> pour qu’il apparaisse dans “à venir”.
//           </div>
//         </div>

//         <div style={styles.actions}>
//           <button type="button" onClick={() => nav(-1)} style={styles.btnGhost}>
//             Annuler
//           </button>
//           <button type="button" onClick={save} disabled={saving} style={{ ...styles.btn, ...(saving ? styles.btnDisabled : null) }}>
//             {saving ? "Enregistrement..." : "Enregistrer"}
//           </button>
//         </div>
//       </div>

//       {notice && (
//         <div style={{ ...styles.notice, ...(notice.type === "ok" ? styles.noticeOk : styles.noticeErr) }}>
//           {notice.text}
//         </div>
//       )}

//       {loading ? (
//         <div style={styles.card}>Chargement…</div>
//       ) : (
//         <div style={styles.card}>
//           <div className="rgAdminGrid2" style={styles.grid2}>
//             <Field label="Titre *" value={data.title} onChange={(v) => setField("title", v)} error={errors.title} />
//             <Field label="Slug (optionnel)" value={data.slug} onChange={(v) => setField("slug", v)} error={errors.slug} />

//             <Field
//               label="Image (URL)"
//               value={data.image}
//               onChange={(v) => setField("image", v)}
//               error={errors.image}
//               placeholder="https://..."
//             />
//             <Field
//               label="Date d’événement (eventDate)"
//               type="date"
//               value={data.eventDate}
//               onChange={(v) => setField("eventDate", v)}
//               error={errors.eventDate}
//             />

//             <Field
//               label="Ordre"
//               type="number"
//               value={data.order}
//               onChange={(v) => setField("order", v)}
//               error={errors.order}
//             />

//             <label style={styles.checkboxRow}>
//               <input type="checkbox" checked={data.published} onChange={(e) => setField("published", e.target.checked)} />
//               <span>Publié</span>
//             </label>
//           </div>

//           <TextArea
//             label="Résumé (short) *"
//             value={data.short}
//             onChange={(v) => setField("short", v)}
//             error={errors.short}
//             rows={4}
//           />

//           <TextArea
//             label="Détails (details)"
//             value={data.details}
//             onChange={(v) => setField("details", v)}
//             rows={10}
//             hint="Ce contenu s’affiche dans le popup (détail)."
//           />
//         </div>
//       )}

//       <style>{`
//         @media (max-width: 900px) {
//           .rgAdminGrid2 { grid-template-columns: 1fr !important; }
//         }
//       `}</style>
//     </div>
//   );
// }

// function Field({ label, value, onChange, error, type = "text", placeholder }) {
//   return (
//     <div style={styles.field}>
//       <div style={styles.label}>{label}</div>
//       <input
//         type={type}
//         value={value}
//         placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         style={{ ...styles.input, ...(error ? styles.inputError : null) }}
//       />
//       {error && <div style={styles.errorText}>{error}</div>}
//     </div>
//   );
// }

// function TextArea({ label, value, onChange, error, rows = 6, hint }) {
//   return (
//     <div style={styles.field}>
//       <div style={styles.label}>{label}</div>
//       <textarea
//         rows={rows}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         style={{ ...styles.textarea, ...(error ? styles.inputError : null) }}
//       />
//       {hint && <div style={styles.hint}>{hint}</div>}
//       {error && <div style={styles.errorText}>{error}</div>}
//     </div>
//   );
// }

// const styles = {
//   page: { maxWidth: 1100, margin: "0 auto", padding: "0 10px" },
//   h1: { margin: 0, fontSize: 28, fontWeight: 950, color: "rgba(255,255,255,0.95)" },
//   sub: { marginTop: 6, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 },

//   topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 12 },
//   actions: { display: "flex", gap: 10, alignItems: "center" },

//   btn: {
//     height: 42,
//     display: "inline-flex",
//     alignItems: "center",
//     padding: "0 14px",
//     borderRadius: 999,
//     background: "rgba(31,79,216,.95)",
//     border: "1px solid rgba(255,255,255,0.14)",
//     color: "white",
//     cursor: "pointer"
//   },
//   btnDisabled: { opacity: 0.7, cursor: "not-allowed" },
//   btnGhost: {
//     height: 42,
//     padding: "0 14px",
//     borderRadius: 999,
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.88)",
//     cursor: "pointer"
//   },

//   notice: { borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid rgba(255,255,255,0.12)" },
//   noticeOk: { background: "rgba(34,197,94,0.10)" },
//   noticeErr: { background: "rgba(239,68,68,0.10)" },

//   card: {
//     borderRadius: 22,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.03)",
//     padding: 16
//   },

//   grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, alignItems: "end" },

//   field: { display: "grid", gap: 6, marginBottom: 12 },
//   label: { fontSize: 13, color: "rgba(255,255,255,0.80)" },
//   input: {
//     width: "100%",
//     padding: "12px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: "rgba(3,10,26,0.35)",
//     color: "rgba(255,255,255,0.92)",
//     outline: "none"
//   },
//   textarea: {
//     width: "100%",
//     padding: "12px 12px",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.12)",
//     background: "rgba(3,10,26,0.35)",
//     color: "rgba(255,255,255,0.92)",
//     outline: "none",
//     resize: "vertical"
//   },
//   inputError: { border: "1px solid rgba(239,68,68,0.55)" },
//   errorText: { fontSize: 12, color: "rgba(239,68,68,0.95)" },
//   hint: { fontSize: 12, color: "rgba(255,255,255,0.60)" },

//   checkboxRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     color: "rgba(255,255,255,0.80)",
//     borderRadius: 14,
//     border: "1px solid rgba(255,255,255,0.10)",
//     background: "rgba(255,255,255,0.02)",
//     padding: "12px 12px",
//     height: 46
//   }
// };


import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../lib/adminApi.js";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

function toInputDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

async function readJson(res) {
  const text = await res.text().catch(() => "");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/**
 * adminJson : wrapper stable autour de adminFetch
 * - garde credentials + CSRF (géré par adminFetch)
 * - parse JSON
 * - throw sur erreurs
 * - throw "UNAUTHORIZED" sur 401 pour redirect login
 */
async function adminJson(url, options = {}) {
  const res = await adminFetch(url, options);

  if (res.status === 401) throw new Error("UNAUTHORIZED");

  const json = await readJson(res);

  if (!res.ok || json?.ok === false) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    const err = new Error(msg);
    // on accroche les erreurs de validation si présentes
    if (json?.errors) err.errors = json.errors;
    throw err;
  }

  return json;
}

export default function AdminFoundationForm({ mode = "create" }) {
  const nav = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // {type:'ok'|'err', text:''}
  const [errors, setErrors] = useState({});

  const initial = useMemo(
    () => ({
      title: "",
      slug: "",
      short: "",
      details: "",
      image: "",
      eventDate: "",
      order: 0,
      published: false,
    }),
    []
  );

  const [data, setData] = useState(initial);

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setNotice(null);
  };

  // Load en mode edit
  useEffect(() => {
    if (!isEdit) return;
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotice(null);
      setErrors({});

      try {
        const json = await adminJson(`/api/admin/foundation/actions/${id}`);
        const it = json?.item || {};

        if (cancelled) return;

        setData({
          title: it.title || "",
          slug: it.slug || "",
          short: it.short || "",
          details: it.details || "",
          image: it.image || "",
          eventDate: toInputDate(it.eventDate),
          order: typeof it.order === "number" ? it.order : 0,
          published: it.published === true,
        });
      } catch (e) {
        if (cancelled) return;

        if (e?.message === "UNAUTHORIZED") {
          nav("/admin/login", { replace: true });
          return;
        }

        setNotice({ type: "err", text: e?.message || "Erreur de chargement" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, id, nav]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setNotice(null);
    setErrors({});

    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        short: data.short,
        details: data.details,
        image: data.image,
        eventDate: data.eventDate, // "YYYY-MM-DD"
        order: Number(data.order || 0),
        published: data.published === true,
      };

      const url = isEdit
        ? `/api/admin/foundation/actions/${id}`
        : `/api/admin/foundation/actions`;

      const method = isEdit ? "PATCH" : "POST";

      await adminJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setNotice({ type: "ok", text: "Enregistré." });
      nav("/admin/foundation", { replace: true });
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") {
        nav("/admin/login", { replace: true });
        return;
      }

      // erreurs de validation renvoyées par l'API
      if (e?.errors) setErrors(e.errors);

      setNotice({ type: "err", text: e?.message || "Erreur sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <h1 style={styles.h1}>
            {isEdit ? "Modifier" : "Nouvelle action/événement"}
          </h1>
          <div style={styles.sub}>
            Mets une <strong>eventDate</strong> pour qu’il apparaisse dans “à venir”.
          </div>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={() => nav(-1)} style={styles.btnGhost}>
            Annuler
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{ ...styles.btn, ...(saving ? styles.btnDisabled : null) }}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
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

      {loading ? (
        <div style={styles.card}>Chargement…</div>
      ) : (
        <div style={styles.card}>
          <div className="rgAdminGrid2" style={styles.grid2}>
            <Field
              label="Titre *"
              value={data.title}
              onChange={(v) => setField("title", v)}
              error={errors.title}
            />
            <Field
              label="Slug (optionnel)"
              value={data.slug}
              onChange={(v) => setField("slug", v)}
              error={errors.slug}
            />

            {/* ✅ Upload + URL */}
            <div style={{ marginBottom: 12 }}>
              <ImageUploader
                label="Image"
                value={data.image}
                onChange={(url) => setField("image", url)}
              />
            </div>

            <Field
              label="Image (URL) (optionnel)"
              value={data.image}
              onChange={(v) => setField("image", v)}
              placeholder="https://... ou /uploads/..."
              error={errors.image}
            />

            <Field
              label="Date d’événement (eventDate)"
              type="date"
              value={data.eventDate}
              onChange={(v) => setField("eventDate", v)}
              error={errors.eventDate}
            />

            <Field
              label="Ordre"
              type="number"
              value={String(data.order ?? 0)}
              onChange={(v) => setField("order", v)}
              error={errors.order}
            />

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={data.published}
                onChange={(e) => setField("published", e.target.checked)}
              />
              <span>Publié</span>
            </label>
          </div>

          <TextArea
            label="Résumé (short) *"
            value={data.short}
            onChange={(v) => setField("short", v)}
            error={errors.short}
            rows={4}
          />

          <TextArea
            label="Détails (details)"
            value={data.details}
            onChange={(v) => setField("details", v)}
            rows={10}
            hint="Ce contenu s’affiche dans le popup (détail)."
          />
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .rgAdminGrid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, ...(error ? styles.inputError : null) }}
      />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function TextArea({ label, value, onChange, error, rows = 6, hint }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.textarea, ...(error ? styles.inputError : null) }}
      />
      {hint && <div style={styles.hint}>{hint}</div>}
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "0 10px" },
  h1: { margin: 0, fontSize: 28, fontWeight: 950, color: "rgba(255,255,255,0.95)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  actions: { display: "flex", gap: 10, alignItems: "center" },

  btn: {
    height: 42,
    display: "inline-flex",
    alignItems: "center",
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer",
  },
  btnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  btnGhost: {
    height: 42,
    padding: "0 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
  },

  notice: { borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid rgba(255,255,255,0.12)" },
  noticeOk: { background: "rgba(34,197,94,0.10)" },
  noticeErr: { background: "rgba(239,68,68,0.10)" },

  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
  },

  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, alignItems: "end" },

  field: { display: "grid", gap: 6, marginBottom: 12 },
  label: { fontSize: 13, color: "rgba(255,255,255,0.80)" },
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

  inputError: { border: "1px solid rgba(239,68,68,0.55)" },
  errorText: { fontSize: 12, color: "rgba(239,68,68,0.95)" },
  hint: { fontSize: 12, color: "rgba(255,255,255,0.60)" },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.80)",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    padding: "12px 12px",
    height: 46,
  },
};