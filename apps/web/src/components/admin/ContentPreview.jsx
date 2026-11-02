import DOMPurify from "dompurify";

export default function ContentPreview({ open, onClose, type, data }) {
  if (!open) return null;
  const title = data.title || "Sans titre";
  const summary = data.excerpt || data.short || "";
  const content = data.content || data.details || "";
  const image = data.coverImage || data.image || "";
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Aperçu du contenu">
      <div style={styles.modal}>
        <div style={styles.top}>
          <div><strong>Aperçu avant publication</strong><div style={styles.meta}>{type}</div></div>
          <button type="button" onClick={onClose} style={styles.close}>Fermer</button>
        </div>
        <article style={styles.article}>
          <span style={styles.category}>{data.category || (data.published ? "Publié" : "Brouillon")}</span>
          <h1 style={styles.title}>{title}</h1>
          {summary && <p style={styles.summary}>{summary}</p>}
          {image && <img src={image} alt="" style={styles.image} />}
          {isHtml ? (
            <div className="rgRich" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
          ) : (
            <div style={styles.copy}>{content || "Aucun contenu détaillé."}</div>
          )}
        </article>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, zIndex: 200, padding: 18, background: "rgba(0,0,0,.78)", display: "grid", placeItems: "center" },
  modal: { width: "min(900px,100%)", maxHeight: "92vh", overflow: "auto", borderRadius: 22, border: "1px solid rgba(255,255,255,.16)", background: "#071127", boxShadow: "0 24px 80px rgba(0,0,0,.5)" },
  top: { position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: 14, background: "rgba(7,17,39,.96)", borderBottom: "1px solid rgba(255,255,255,.1)" },
  meta: { marginTop: 3, fontSize: 12, color: "rgba(255,255,255,.55)" }, close: { padding: "9px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.06)", color: "white" },
  article: { padding: "clamp(18px,4vw,44px)" }, category: { color: "#5FB7FF", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" },
  title: { margin: "10px 0", fontSize: "clamp(28px,5vw,44px)" }, summary: { color: "rgba(255,255,255,.72)", fontSize: 18, lineHeight: 1.7 },
  image: { width: "100%", maxHeight: 460, objectFit: "cover", borderRadius: 18, margin: "14px 0" }, copy: { whiteSpace: "pre-wrap", color: "rgba(255,255,255,.82)", lineHeight: 1.8 },
};
