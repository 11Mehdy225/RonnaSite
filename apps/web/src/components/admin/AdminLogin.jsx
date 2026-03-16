import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@ronnagroup.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setErr(null);
//     setLoading(true);

//     try {
//       // const res = await fetch("/api/admin/auth/login", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({ email, password })
//       // });
//     const res =  await fetch("/api/admin/auth/login", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   credentials: "include",
//   body: JSON.stringify({ email, password }),
// });

//       const json = await res.json().catch(() => ({}));

//       if (!res.ok || json?.ok !== true || !json?.token) {
//         setErr(json?.message || "Connexion impossible. Vérifie tes identifiants.");
//         return;
//       }

//       localStorage.setItem("rg_admin_token", json.token);
//       localStorage.setItem("rg_admin_role", json.role || "ADMIN");
//       nav("/admin/quotes", { replace: true });
//     } catch(e) {
//         console.error(e);
//     setErr("Erreur réseau. Vérifie que l’API tourne (localhost:4000).");
//     } finally {
//       setLoading(false);
//     }
//   };
  const onSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setErr(null);
  setLoading(true);

  try {
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
       headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "rg-admin",
  },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.ok !== true) {
      setErr(json?.message || "Connexion impossible. Vérifie tes identifiants.");
      return;
    }

    // ✅ plus de localStorage token
    nav("/admin/quotes", { replace: true });
  } catch (e) {
    console.error(e);
    setErr("Erreur réseau. Vérifie que l’API tourne (localhost:4000).");
  } finally {
    setLoading(false);
  }
};

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.title}>Admin • Connexion</div>
        <div style={styles.sub}>
          Accès réservé à l’équipe RONNA GROUP.
        </div>

        {err && <div style={styles.err}>{err}</div>}

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />

          <label style={styles.label}>Mot de passe</label>
          <input
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDis : null) }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  main: { padding: "96px 18px 60px", display: "grid", placeItems: "center" },
  card: {
    width: "min(520px, 100%)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    padding: 18
  },
  title: { fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.92)" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 },
  err: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(239,68,68,0.30)",
    background: "rgba(239,68,68,0.10)",
    color: "rgba(255,255,255,0.90)"
  },
  form: { marginTop: 14, display: "grid", gap: 10 },
  label: { fontSize: 12, color: "rgba(255,255,255,0.72)" },
  input: {
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none"
  },
  btn: {
    marginTop: 6,
    padding: "12px 14px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.18)",
    cursor: "pointer"
  },
  btnDis: { opacity: 0.7, cursor: "not-allowed" }
};
