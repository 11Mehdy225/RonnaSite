import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setNotice("");
    try {
      const res = await fetch("/api/admin/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const json = await res.json();
      setNotice(json.message || "Si ce compte existe, un email a été envoyé.");
    } catch { setNotice("Service momentanément indisponible."); }
    finally { setLoading(false); }
  };

  return <main style={styles.main}><form onSubmit={submit} style={styles.card}>
    <h1>Mot de passe oublié</h1><p>Indiquez l’adresse du compte administrateur. Le lien sera valable 30 minutes.</p>
    <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} /></label>
    {notice && <div style={styles.notice}>{notice}</div>}
    <button disabled={loading} style={styles.button}>{loading ? "Envoi…" : "Recevoir le lien"}</button>
    <Link to="/admin/login">← Retour à la connexion</Link>
  </form></main>;
}

const styles = { main: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }, card: { width: "min(520px,100%)", display: "grid", gap: 14, padding: 22, borderRadius: 22, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)" }, input: { display: "block", width: "100%", marginTop: 7, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.14)", background: "#071127", color: "white" }, button: { padding: 12, borderRadius: 999, border: 0, background: "#1F4FD8", color: "white", fontWeight: 800 }, notice: { padding: 11, borderRadius: 12, background: "rgba(95,183,255,.12)" } };
