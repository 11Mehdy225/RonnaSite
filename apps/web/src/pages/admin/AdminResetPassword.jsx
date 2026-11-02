import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function AdminResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [notice, setNotice] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 12) return setNotice({ error: true, text: "12 caractères minimum." });
    if (password !== confirm) return setNotice({ error: true, text: "Les mots de passe ne correspondent pas." });
    try {
      const res = await fetch("/api/admin/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: params.get("token") || "", newPassword: password }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setNotice({ error: false, text: "Mot de passe modifié. Vous pouvez vous connecter." });
    } catch (error) { setNotice({ error: true, text: error.message || "Modification impossible." }); }
  };

  return <main style={styles.main}><form onSubmit={submit} style={styles.card}>
    <h1>Nouveau mot de passe</h1>
    <label>Nouveau mot de passe<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} /></label>
    <label>Confirmer<input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={styles.input} /></label>
    {notice && <div style={styles.notice}>{notice.text}</div>}
    <button style={styles.button}>Modifier le mot de passe</button>
    <Link to="/admin/login">Retour à la connexion</Link>
  </form></main>;
}

const styles = { main: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }, card: { width: "min(520px,100%)", display: "grid", gap: 14, padding: 22, borderRadius: 22, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)" }, input: { display: "block", width: "100%", marginTop: 7, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.14)", background: "#071127", color: "white" }, button: { padding: 12, borderRadius: 999, border: 0, background: "#1F4FD8", color: "white", fontWeight: 800 }, notice: { padding: 11, borderRadius: 12, background: "rgba(95,183,255,.12)" } };
