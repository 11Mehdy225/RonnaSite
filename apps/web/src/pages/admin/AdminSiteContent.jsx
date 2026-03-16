import { useEffect, useMemo, useState } from "react";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import {
  createTeamMember,
  deleteTeamMember,
  getSiteContent,
  getTeam,
  putSiteContent,
  updateTeamMember,
} from "../../lib/adminApi.js";

const TABS = [
  { key: "ceo_message", label: "Mot du PDG" },
  { key: "team_members", label: "Équipe" },
  { key: "team_video", label: "Vidéo interview" },
  { key: "about_group", label: "Page Groupe" },
];

export default function AdminSiteContent() {
  const [tab, setTab] = useState("ceo_message");

  return (
    <div style={s.wrap}>
      <div style={s.top}>
        <div>
          <div style={s.h1}>Pages du site</div>
          <div style={s.sub}>Gère le contenu statique (PDG, Équipe, Vidéo, Groupe).</div>
        </div>
      </div>

      <div style={s.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{ ...s.tab, ...(tab === t.key ? s.tabActive : null) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ceo_message" && <CeoBlock />}
      {tab === "team_members" && <TeamBlock />}
      {tab === "team_video" && <VideoBlock />}
      {tab === "about_group" && <AboutBlock />}
    </div>
  );
}

/* ───────────────── PDG ───────────────── */

function CeoBlock() {
  const [data, setData] = useState({ title: "Mot du PDG", name: "", role: "PDG", photo: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const item = await getSiteContent("ceo_message");
        if (!alive) return;
        setData({
          title: item?.title || "Mot du PDG",
          name: item?.name || "",
          role: item?.role || "PDG",
          photo: item?.photo || "",
          message: item?.message || "",
        });
      } catch (e) {
        if (!alive) return;
        setNotice({ type: "err", text: e.message || "Erreur chargement" });
      } finally {
        if (!alive) 
            // return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const save = async () => {
    if (saving) return;
    setNotice(null);
    setSaving(true);
    try {
      await putSiteContent("ceo_message", data);
      setNotice({ type: "ok", text: "Enregistré ✅" });
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={s.state}>Chargement…</div>;

  return (
    <div style={s.card}>
      {notice && <Notice notice={notice} />}
      <div style={s.grid2}>
        <Field label="Titre" value={data.title} onChange={(v) => setData((d) => ({ ...d, title: v }))} />
        <Field label="Nom" value={data.name} onChange={(v) => setData((d) => ({ ...d, name: v }))} />
      </div>
      <div style={s.grid2}>
        <Field label="Rôle" value={data.role} onChange={(v) => setData((d) => ({ ...d, role: v }))} />
        <ImageUploader label="Photo" value={data.photo} onChange={(v) => setData((d) => ({ ...d, photo: v }))} />
      </div>
      <TextArea label="Message" rows={8} value={data.message} onChange={(v) => setData((d) => ({ ...d, message: v }))} />
      <button type="button" onClick={save} disabled={saving} style={{ ...s.btn, ...(saving ? s.btnDis : null) }}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}

/* ───────────────── ÉQUIPE ───────────────── */

function TeamBlock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const [form, setForm] = useState({ fullName: "", position: "", photo: "", bio: "", order: 0, active: true });
  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const load = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const arr = await getTeam();
      // Backend renvoie _id ObjectId -> en JSON ça arrive parfois comme objet; on sécurise:
      const normalized = arr.map((x) => ({ ...x, _id: String(x._id) }));
      setItems(normalized);
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur chargement" });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditingId(null);
    setForm({ fullName: "", position: "", photo: "", bio: "", order: 0, active: true });
  };

  const submit = async () => {
    setNotice(null);
    try {
      if (!form.fullName.trim() || !form.position.trim()) {
        setNotice({ type: "err", text: "Nom + poste requis." });
        return;
      }
      if (isEditing) {
        await updateTeamMember(editingId, form);
        setNotice({ type: "ok", text: "Modifié ✅" });
      } else {
        await createTeamMember(form);
        setNotice({ type: "ok", text: "Ajouté ✅" });
      }
      reset();
      await load();
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur" });
    }
  };

  const edit = (m) => {
    setEditingId(String(m._id));
    setForm({
      fullName: m.fullName || "",
      position: m.position || "",
      photo: m.photo || "",
      bio: m.bio || "",
      order: Number(m.order || 0),
      active: m.active !== false,
    });
    setNotice(null);
  };

  const remove = async (id) => {
    const ok = window.confirm("Supprimer ce membre ? (irréversible)");
    if (!ok) return;
    setNotice(null);
    try {
      await deleteTeamMember(id);
      setNotice({ type: "ok", text: "Supprimé ✅" });
      if (editingId === id) reset();
      await load();
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur suppression" });
    }
  };

  return (
    <div style={s.gridTeam}>
      <div style={s.card}>
        <div style={s.sectionTitle}>Membres</div>
        {notice && <Notice notice={notice} />}

        {loading ? (
          <div style={s.state}>Chargement…</div>
        ) : items.length === 0 ? (
          <div style={s.empty}>Aucun membre.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((m) => (
              <div key={m._id} style={s.teamRow}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                  {m.photo ? <img src={m.photo} alt="" style={s.avatar} /> : <div style={s.avatarPh} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={s.teamName}>{m.fullName || "—"}</div>
                    <div style={s.teamMeta}>
                      {m.position || "—"} • order: {Number(m.order || 0)} • {m.active === false ? "INACTIF" : "ACTIF"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" style={s.btnGhost} onClick={() => edit(m)}>Modifier</button>
                  <button type="button" style={s.btnDanger} onClick={() => remove(m._id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button" style={s.btnGhost} onClick={load} disabled={loading}>
          Rafraîchir
        </button>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>{isEditing ? "Modifier un membre" : "Ajouter un membre"}</div>

        <div style={s.grid2}>
          <Field label="Nom complet" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
          <Field label="Poste" value={form.position} onChange={(v) => setForm((f) => ({ ...f, position: v }))} />
        </div>

        <ImageUploader label="Photo" value={form.photo} onChange={(v) => setForm((f) => ({ ...f, photo: v }))} />

        <TextArea label="Bio (optionnel)" rows={5} value={form.bio} onChange={(v) => setForm((f) => ({ ...f, bio: v }))} />

        <div style={s.grid2}>
          <Field
            label="Order (nombre)"
            value={String(form.order)}
            onChange={(v) => setForm((f) => ({ ...f, order: Number(v) }))}
          />
          <label style={s.checkRow}>
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            <span>Actif</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={submit} style={s.btn}>
            {isEditing ? "Enregistrer" : "Ajouter"}
          </button>
          {isEditing && (
            <button type="button" onClick={reset} style={s.btnGhost}>
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── VIDÉO ───────────────── */

function VideoBlock() {
  const [data, setData] = useState({ title: "Interview", url: "", caption: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const item = await getSiteContent("team_video");
        if (!alive) return;
        setData({
          title: item?.title || "Interview",
          url: item?.url || "",
          caption: item?.caption || "",
        });
      } catch (e) {
        if (!alive) return;
        setNotice({ type: "err", text: e.message || "Erreur" });
      } finally {
        if (!alive) 
            // return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setNotice(null);
    try {
      await putSiteContent("team_video", data);
      setNotice({ type: "ok", text: "Enregistré ✅" });
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={s.state}>Chargement…</div>;

  return (
    <div style={s.card}>
      {notice && <Notice notice={notice} />}
      <Field label="Titre" value={data.title} onChange={(v) => setData((d) => ({ ...d, title: v }))} />
      <Field label="URL vidéo (YouTube/Vimeo)" value={data.url} onChange={(v) => setData((d) => ({ ...d, url: v }))} />
      <TextArea label="Description" rows={4} value={data.caption} onChange={(v) => setData((d) => ({ ...d, caption: v }))} />

      <button type="button" onClick={save} disabled={saving} style={{ ...s.btn, ...(saving ? s.btnDis : null) }}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}

/* ───────────────── GROUPE ───────────────── */

function AboutBlock() {
  const [data, setData] = useState({ title: "Le Groupe", coverImage: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const item = await getSiteContent("about_group");
        if (!alive) return;
        setData({
          title: item?.title || "Le Groupe",
          coverImage: item?.coverImage || "",
          content: item?.content || "",
        });
      } catch (e) {
        if (!alive) return;
        setNotice({ type: "err", text: e.message || "Erreur" });
      } finally {
        if (!alive) 
            // return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setNotice(null);
    try {
      await putSiteContent("about_group", data);
      setNotice({ type: "ok", text: "Enregistré ✅" });
    } catch (e) {
      setNotice({ type: "err", text: e.message || "Erreur" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={s.state}>Chargement…</div>;

  return (
    <div style={s.card}>
      {notice && <Notice notice={notice} />}
      <Field label="Titre" value={data.title} onChange={(v) => setData((d) => ({ ...d, title: v }))} />
      <ImageUploader label="Image de couverture" value={data.coverImage} onChange={(v) => setData((d) => ({ ...d, coverImage: v }))} />
      <TextArea label="Contenu" rows={10} value={data.content} onChange={(v) => setData((d) => ({ ...d, content: v }))} />
      <button type="button" onClick={save} disabled={saving} style={{ ...s.btn, ...(saving ? s.btnDis : null) }}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}

/* ───────────────── UI helpers ───────────────── */

function Notice({ notice }) {
  return (
    <div style={{ ...s.notice, ...(notice.type === "ok" ? s.noticeOk : s.noticeErr) }}>
      {notice.text}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={s.field}>
      <div style={s.label}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={s.input} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 6 }) {
  return (
    <div style={s.field}>
      <div style={s.label}>{label}</div>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} style={s.textarea} />
    </div>
  );
}

const s = {
  wrap: { maxWidth: 1200, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h1: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.65)" },

  tabs: { marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" },
  tab: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.86)",
    cursor: "pointer",
  },
  tabActive: { background: "rgba(31,79,216,0.16)", borderColor: "rgba(31,79,216,0.35)" },

  gridTeam: { marginTop: 14, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 },
  card: {
    marginTop: 14,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 14,
  },
  sectionTitle: { fontWeight: 950, color: "rgba(255,255,255,0.90)", marginBottom: 10 },

  field: { display: "grid", gap: 6, marginBottom: 10 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.70)" },
  input: {
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  },
  textarea: {
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical",
  },

  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },

  notice: { marginBottom: 10, borderRadius: 14, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.12)" },
  noticeOk: { background: "rgba(34,197,94,0.10)" },
  noticeErr: { background: "rgba(239,68,68,0.10)" },

  teamRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,10,26,0.24)",
    alignItems: "center",
  },
  avatar: { width: 42, height: 42, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.10)" },
  avatarPh: { width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" },
  teamName: { fontWeight: 900, color: "rgba(255,255,255,0.90)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  teamMeta: { marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.60)" },

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

  btn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "white",
    cursor: "pointer",
  },
  btnDis: { opacity: 0.7, cursor: "not-allowed" },
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
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    color: "rgba(255,255,255,0.74)",
  },
  empty: { padding: 14, color: "rgba(255,255,255,0.65)" },
};