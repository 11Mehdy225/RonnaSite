import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "../../lib/adminApi.js";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (form.newPassword.length < 12) {
      setNotice({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 12 caractères." });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setNotice({ type: "error", text: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const response = await adminFetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.ok !== true) throw new Error(json?.message || "Modification impossible.");

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setNotice({ type: "success", text: "Mot de passe modifié. Redirection vers la connexion…" });
      window.setTimeout(() => navigate("/admin/login", { replace: true }), 1200);
    } catch (error) {
      setNotice({ type: "error", text: error?.message || "Modification impossible." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={styles.page}>
      <div>
        <div style={styles.kicker}>Compte administrateur</div>
        <h1 style={styles.title}>Sécurité</h1>
        <p style={styles.lead}>Modifiez régulièrement votre mot de passe et ne le partagez jamais par message.</p>
      </div>

      <form onSubmit={submit} style={styles.card}>
        <PasswordField
          label="Mot de passe actuel"
          value={form.currentPassword}
          onChange={(value) => update("currentPassword", value)}
          autoComplete="current-password"
        />
        <PasswordField
          label="Nouveau mot de passe"
          value={form.newPassword}
          onChange={(value) => update("newPassword", value)}
          autoComplete="new-password"
          hint="12 caractères minimum. Utilisez une phrase longue et unique."
        />
        <PasswordField
          label="Confirmer le nouveau mot de passe"
          value={form.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          autoComplete="new-password"
        />

        {notice && (
          <div style={{ ...styles.notice, ...(notice.type === "success" ? styles.success : styles.error) }}>
            {notice.text}
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ ...styles.button, ...(submitting ? styles.buttonDisabled : null) }}>
          {submitting ? "Modification…" : "Modifier le mot de passe"}
        </button>
      </form>
    </section>
  );
}

function PasswordField({ label, value, onChange, autoComplete, hint }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        style={styles.input}
      />
      {hint && <span style={styles.hint}>{hint}</span>}
    </label>
  );
}

const styles = {
  page: { maxWidth: 760, margin: "0 auto", display: "grid", gap: 18 },
  kicker: { color: "rgba(95,183,255,0.9)", textTransform: "uppercase", letterSpacing: 1.3, fontSize: 12, fontWeight: 800 },
  title: { margin: "7px 0 0", fontSize: 28 },
  lead: { margin: "8px 0 0", color: "rgba(255,255,255,0.68)", lineHeight: 1.6 },
  card: { padding: 18, borderRadius: 22, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)", display: "grid", gap: 15 },
  field: { display: "grid", gap: 7 },
  label: { color: "rgba(255,255,255,0.82)", fontSize: 13, fontWeight: 700 },
  input: { width: "100%", height: 46, padding: "0 13px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(3,10,26,0.5)", color: "white", outline: "none" },
  hint: { color: "rgba(255,255,255,0.55)", fontSize: 12 },
  notice: { padding: "11px 13px", borderRadius: 14, fontSize: 13.5 },
  success: { color: "rgba(187,247,208,0.95)", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.28)" },
  error: { color: "rgba(254,202,202,0.95)", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)" },
  button: { justifySelf: "start", padding: "12px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(31,79,216,0.95)", color: "white", cursor: "pointer" },
  buttonDisabled: { opacity: 0.6, cursor: "wait" },
};
