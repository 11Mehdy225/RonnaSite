import { useRef, useState } from "react";
import { adminUploadFile } from "../../lib/adminApi.js";

export default function GalleryUploader({
  label = "Galerie",
  value = [],
  onChange
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const pick = () => inputRef.current?.click();

  const addFile = async (file) => {
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const url = await adminUploadFile(file);
      const next = [...(Array.isArray(value) ? value : []), url];
      onChange?.(next);
    } catch (e) {
      setErr(e?.message || "Upload échoué");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx) => {
    const next = (Array.isArray(value) ? value : []).filter((_, i) => i !== idx);
    onChange?.(next);
  };

  return (
    <div style={s.block}>
      <div style={s.top}>
        <div style={s.label}>{label}</div>
        <button type="button" onClick={pick} disabled={uploading} style={{ ...s.btn, ...(uploading ? s.btnDis : null) }}>
          {uploading ? "Upload…" : "Ajouter une image"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={(e) => addFile(e.target.files?.[0])}
      />

      {Array.isArray(value) && value.length > 0 ? (
        <div style={s.grid}>
          {value.map((url, i) => (
            <div key={url + i} style={s.item}>
              <img src={url} alt="" style={s.img} />
              <button type="button" style={s.rm} onClick={() => removeAt(i)}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={s.empty}>Aucune image dans la galerie</div>
      )}

      {err && <div style={s.err}>Erreur : {err}</div>}
    </div>
  );
}

const s = {
  block: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12
  },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  label: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 800 },
  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(31,79,216,.95)",
    color: "white",
    cursor: "pointer"
  },
  btnDis: { opacity: 0.7, cursor: "not-allowed" },
  grid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 },
  item: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.14)"
  },
  img: { width: "100%", height: 160, objectFit: "cover", display: "block" },
  rm: {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    background: "rgba(239,68,68,0.14)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer"
  },
  empty: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    border: "1px dashed rgba(255,255,255,0.16)",
    color: "rgba(255,255,255,0.60)"
  },
  err: { marginTop: 10, color: "rgba(239,68,68,0.92)", fontSize: 12 }
};