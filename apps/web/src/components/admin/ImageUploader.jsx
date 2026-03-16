import { useRef, useState } from "react";
import { adminUploadFile } from "../../lib/adminApi.js";

export default function ImageUploader({
  label = "Image",
  value = "",
  onChange,
  hint = "PNG/JPG/WEBP (max 6MB)"
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const pick = () => inputRef.current?.click();

  const handleFile = async (file) => {
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const url = await adminUploadFile(file);
      onChange?.(url);
    } catch (e) {
      setErr(e?.message || "Upload échoué");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={s.block}>
      <div style={s.top}>
        <div>
          <div style={s.label}>{label}</div>
          <div style={s.hint}>{hint}</div>
        </div>

        <button type="button" onClick={pick} disabled={uploading} style={{ ...s.btn, ...(uploading ? s.btnDis : null) }}>
          {uploading ? "Upload…" : "Choisir"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div style={s.previewWrap}>
          <img src={value} alt="" style={s.previewImg} />
          <div style={s.previewUrl}>{value}</div>

          <div style={s.actions}>
            <button type="button" style={s.btnGhost} onClick={() => onChange?.("")}>
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <div style={s.empty}>Aucune image</div>
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
  hint: { marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.55)" },
  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(31,79,216,.95)",
    color: "white",
    cursor: "pointer"
  },
  btnDis: { opacity: 0.7, cursor: "not-allowed" },

  previewWrap: { marginTop: 10, display: "grid", gap: 10 },
  previewImg: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)"
  },
  previewUrl: {
    fontSize: 12,
    color: "rgba(255,255,255,0.60)",
    wordBreak: "break-all"
  },
  actions: { display: "flex", gap: 10 },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer"
  },
  empty: {
    marginTop: 10,
    borderRadius: 14,
    padding: 12,
    border: "1px dashed rgba(255,255,255,0.16)",
    color: "rgba(255,255,255,0.60)"
  },
  err: {
    marginTop: 10,
    color: "rgba(239,68,68,0.92)",
    fontSize: 12
  }
};