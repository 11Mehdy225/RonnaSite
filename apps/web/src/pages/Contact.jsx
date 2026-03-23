import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import SEO from "../components/SEO"; 
import { apiUrl } from "../lib/api.js";


const SERVICE_OPTIONS = [
  { value: "RONNA_DIGITAL", label: "Ronna Digital" },
  { value: "RONNA_WEB", label: "Ronna Web" },
  { value: "RONNA_TV", label: "Ronna TV" },
  { value: "RONNA_DEVELOPPEMENT", label: "Ronna Développement" },
  { value: "RONNA_SECURITE", label: "Ronna Sécurité" },
  { value: "RONNA_AUDIT", label: "Ronna Audit" },
  { value: "RONNA_FORMATION", label: "Ronna Formation" },
  { value: "RONNA_CONSEIL_MANAGEMENT", label: "Ronna Conseil & Management" },
  { value: "AUTRE", label: "Autre" }
];

const BUDGET_OPTIONS = [
  { value: "LT_300K", label: "< 300k FCFA" },
  { value: "300K_1M", label: "300k – 1M FCFA" },
  { value: "1M_3M", label: "1M – 3M FCFA" },
  { value: "GT_3M", label: "3M+ FCFA" },
  { value: "UNKNOWN", label: "À discuter" }
];

const TIMELINE_OPTIONS = [
  { value: "URGENT_1_2_WEEKS", label: "Urgent (1–2 semaines)" },
  { value: "ONE_MONTH", label: "1 mois" },
  { value: "TWO_THREE_MONTHS", label: "2–3 mois" },
  { value: "GT_3_MONTHS", label: "+3 mois" },
  { value: "DISCUSS", label: "À discuter" }
];

const CONTACT_PREF_OPTIONS = [
  { value: "CALL", label: "Appel" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Rendez-vous" }
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function Contact() {

useEffect(() => {
  document.title = "RonnaGroup | Contact";
}, []);

  const initial = useMemo(
    () => ({
      // A
      fullName: "",
      email: "",
      phone: "",
      company: "",
      role: "",

      // B
      service: "RONNA_WEB",
      subject: "",
      message: "",

      // C
      budgetRange: "",
      timeline: "",
      preferredContact: "",

      // D
      consent: false,

      // anti-spam
      honeypot: ""
    }),
    []
  );
 

  

  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // {type:'success'|'error', text:''}

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setNotice(null);
  };

  const validate = () => {
    const e = {};

    // A (obligatoire)
    if (!data.fullName.trim() || data.fullName.trim().length < 2) e.fullName = "Nom & Prénoms requis.";
    if (!isValidEmail(data.email)) e.email = "Email invalide.";
    if (!data.phone.trim() || data.phone.trim().length < 6) e.phone = "Téléphone requis.";
    if (!data.company.trim() || data.company.trim().length < 2) e.company = "Entreprise/Organisation requis.";
    if (!data.role.trim() || data.role.trim().length < 2) e.role = "Rôle/Fonction requis.";

    // B (obligatoire)
    if (!data.service) e.service = "Veuillez choisir un service.";
    if (!data.subject.trim() || data.subject.trim().length < 3) e.subject = "Objet requis (min 3 caractères).";
    if (!data.message.trim() || data.message.trim().length < 10) e.message = "Message requis (min 10 caractères).";

    // D (obligatoire)
    if (data.consent !== true) e.consent = "Consentement requis.";

    // honeypot (doit rester vide)
    if (data.honeypot) e.honeypot = "Champ invalide.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

//   const onSubmit = async (ev) => {
//     ev.preventDefault();
//     if (submitting) return;

//     const ok = validate();
//     if (!ok) {
//       setNotice({ type: "error", text: "Veuillez corriger les champs en erreur." });
//       return;
//     }

//     setSubmitting(true);
//     setNotice(null);

//     try {
//       // Construction payload conforme au backend (Zod)
//    const payload = {
//   type: "DEVIS", // ou "CONTACT" si tu veux distinguer plus tard
//   name: data.fullName.trim(),
//   email: data.email.trim(),
//   phone: data.phone.trim(),
//   subject: data.subject.trim(),
//   message: data.message.trim(),
//   honeypot: data.honeypot || "",

//   // tout le reste part dans meta (optionnel)
//   meta: {
//     company: data.company.trim(),
//     role: data.role.trim(),
//     service: data.service,
//     budgetRange: data.budgetRange || "",
//     timeline: data.timeline || "",
//     preferredContact: data.preferredContact || "",
//     consent: true
//   }
// };

     

//      const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const json = await res.json().catch(() => ({}));

//       if (!res.ok || json?.ok === false) {
//         // Affiche erreurs backend si dispo
//         setNotice({ type: "error", text: "Échec d’envoi. Réessayez ou contactez-nous." });
//         if (json?.details?.fieldErrors) {
//           // Zod flatten
//           const be = {};
//           for (const [k, arr] of Object.entries(json.details.fieldErrors)) {
//             if (arr && arr.length) be[k] = arr[0];
//           }
//           setErrors((prev) => ({ ...prev, ...be }));
//         }
//         return;
//       }

//       setNotice({
//         type: "success",
//         text: `Demande envoyée avec succès. Référence: ${json.id || "—"}`
//       });
//       setData(initial);
//     } catch (err) {
//       console.error(err);
//       setNotice({ type: "error", text: "Erreur réseau. Vérifiez votre connexion et réessayez." });
//     } finally {
//       setSubmitting(false);
//     }
//   };

// const onSubmit = async (ev) => {
//   ev.preventDefault();
//   if (submitting) return;

//   const ok = validate();
//   if (!ok) {
//     setNotice({ type: "error", text: "Veuillez corriger les champs en erreur." });
//     return;
//   }

//   setSubmitting(true);
//   setNotice(null);

//   try {
//     const payload = {
//       type: "DEVIS", // ou "CONTACT"
//       name: data.fullName.trim(),
//       email: data.email.trim(),
//       phone: data.phone.trim(),
//       subject: data.subject.trim(),
//       message: data.message.trim(),
//       honeypot: data.honeypot || "",

//       meta: {
//         company: data.company.trim(),
//         role: data.role.trim(),
//         service: data.service,
//         budgetRange: data.budgetRange || "",
//         timeline: data.timeline || "",
//         preferredContact: data.preferredContact || "",
//         consent: true,
//       },
//     };

//     const res = await fetch("/api/contact", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const json = await res.json().catch(() => ({}));

//     if (!res.ok || json?.ok === false) {
//       setNotice({ type: "error", text: json?.message || "Échec d’envoi. Réessayez ou contactez-nous." });
//       return;
//     }

//     setNotice({
//       type: "success",
//       text: `Demande envoyée avec succès. Référence: ${json.id || "—"}`,
//     });
//     setData(initial);
//   } catch (err) {
//     console.error(err);
//     setNotice({ type: "error", text: "Erreur réseau. Vérifiez votre connexion et réessayez." });
//   } finally {
//     setSubmitting(false);
//   }
// };
  
const onSubmit = async (ev) => {
  ev.preventDefault();
  if (submitting) return;

  const ok = validate();
  if (!ok) {
    setNotice({ type: "error", text: "Veuillez corriger les champs en erreur." });
    return;
  }

  setSubmitting(true);
  setNotice(null);

  try {
    const payload = {
  type: "DEVIS",
  fullName: data.fullName.trim(),
  email: data.email.trim(),
  phone: data.phone.trim(),
  company: data.company.trim(),
  role: data.role.trim(),
  service: data.service,
  subject: data.subject.trim(),
  message: data.message.trim(),
  budgetRange: data.budgetRange || undefined,
  timeline: data.timeline || undefined,
  preferredContact: data.preferredContact || undefined,
  consent: true,
  honeypot: data.honeypot || ""
};

const res = await fetch(apiUrl("/api/contact"), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.ok === false) {
      // erreurs Zod (si présentes)
      if (json?.details?.fieldErrors) {
        const be = {};
        for (const [k, arr] of Object.entries(json.details.fieldErrors)) {
          if (arr?.length) be[k] = arr[0];
        }
        setErrors((prev) => ({ ...prev, ...be }));
      }

      setNotice({ type: "error", text: json?.message || "Échec d’envoi. Réessayez." });
      return;
    }

    setNotice({
      type: "success",
      text: `Demande envoyée. Référence: ${json.id || "—"}`
    });
    setData(initial);
  } catch (err) {
    console.error(err);
    setNotice({ type: "error", text: "Erreur réseau. Vérifiez votre connexion et réessayez." });
  } finally {
    setSubmitting(false);
  }
};

const [params] = useSearchParams();

useEffect(() => {
  const s = params.get("service");
  if (!s) return;

  setData((prev) => ({
    ...prev,
    service: s
  }));
}, [params]);


  return (
    <>
    <SEO
  title="Contact"
  description="Contactez Ronna Group pour toute collaboration ou partenariat."
  canonical="https://ronnagroup.com/contact"
/>
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Contact & Demande de devis</h1>
          <p style={styles.lead}>
            Décrivez votre besoin. Nous vous recontactons rapidement pour cadrer, planifier et lancer.
          </p>
        </header>

        <form onSubmit={onSubmit} style={styles.card}>
          {notice && (
            <div style={{ ...styles.notice, ...(notice.type === "success" ? styles.noticeSuccess : styles.noticeError) }}>
              {notice.text}
            </div>
          )}

          {/* Honeypot (invisible) */}
          <div style={styles.hpWrap} aria-hidden="true">
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={data.honeypot}
                onChange={(e) => setField("honeypot", e.target.value)}
              />
            </label>
          </div>

          {/* A) Identité & contact */}
          <section style={styles.section}>
            <div style={styles.sectionTitle}>A) Identité & contact</div>

            <div className="_rg_contact_grid2" style={styles.grid2}>
              <Field
                label="Nom & Prénoms *"
                value={data.fullName}
                onChange={(v) => setField("fullName", v)}
                error={errors.fullName}
              />
              <Field
                label="Entreprise / Organisation *"
                value={data.company}
                onChange={(v) => setField("company", v)}
                error={errors.company}
              />
              <Field
                label="Email *"
                type="email"
                value={data.email}
                onChange={(v) => setField("email", v)}
                error={errors.email}
              />
              <Field
                label="Téléphone (WhatsApp) *"
                value={data.phone}
                onChange={(v) => setField("phone", v)}
                error={errors.phone}
              />
              <Field
                label="Rôle / Fonction *"
                value={data.role}
                onChange={(v) => setField("role", v)}
                error={errors.role}
              />
            </div>
          </section>

          {/* B) Nature de la demande */}
          <section style={styles.section}>
            <div style={styles.sectionTitle}>B) Nature de la demande</div>

            <div className="_rg_contact_grid2" style={styles.grid2}>
              <SelectField
                label="Service concerné *"
                value={data.service}
                onChange={(v) => setField("service", v)}
                error={errors.service}
                options={SERVICE_OPTIONS}
              />
              <Field
                label="Objet *"
                value={data.subject}
                onChange={(v) => setField("subject", v)}
                error={errors.subject}
              />
            </div>

            <TextAreaField
              label="Description du besoin *"
              value={data.message}
              onChange={(v) => setField("message", v)}
              error={errors.message}
              rows={7}
              hint="Contexte, objectifs, livrables attendus, contraintes éventuelles."
            />
          </section>

          {/* C) Cadre projet (optionnel) */}
          <section style={styles.section}>
            <div style={styles.sectionTitle}>C) Cadre projet (optionnel)</div>

            <div className="_rg_contact_grid2" style={styles.grid2}>
              <SelectField
                label="Budget estimatif"
                value={data.budgetRange}
                onChange={(v) => setField("budgetRange", v)}
                options={[{ value: "", label: "—" }, ...BUDGET_OPTIONS]}
              />
              <SelectField
                label="Délai souhaité"
                value={data.timeline}
                onChange={(v) => setField("timeline", v)}
                options={[{ value: "", label: "—" }, ...TIMELINE_OPTIONS]}
              />
              <SelectField
                label="Canal préféré"
                value={data.preferredContact}
                onChange={(v) => setField("preferredContact", v)}
                options={[{ value: "", label: "—" }, ...CONTACT_PREF_OPTIONS]}
              />
            </div>
          </section>

          {/* D) Consentement */}
          <section style={styles.section}>
            <div style={styles.sectionTitle}>D) Consentement</div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => setField("consent", e.target.checked)}
              />
              <span>
                J’accepte que mes informations soient utilisées pour être recontacté dans le cadre de ma demande. *
              </span>
            </label>
            {errors.consent && <div style={styles.errorText}>{errors.consent}</div>}
          </section>

          <div style={styles.actions}>
            <button type="submit" disabled={submitting} style={{ ...styles.btn, ...(submitting ? styles.btnDisabled : null) }}>
              {submitting ? "Envoi..." : "Envoyer la demande"}
            </button>
            <div style={styles.smallNote}>
              Les champs marqués * sont obligatoires.
            </div>
          </div>
        </form>
      </div>
    </main>
    </>
  );
}

function Field({ label, value, onChange, type = "text", error }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, ...(error ? styles.inputError : null) }}
      />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, ...(error ? styles.inputError : null) }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function TextAreaField({ label, value, onChange, error, rows = 6, hint }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ ...styles.textarea, ...(error ? styles.inputError : null) }}
      />
      {hint && <div style={styles.hint}>{hint}</div>}
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

const styles = {
  main: { padding: "86px 0 60px" },
  container: { maxWidth: 980, margin: "0 auto", padding: "0 18px" },
  header: { maxWidth: 760, margin: "0 auto 18px", textAlign: "center" },
  h1: { margin: 0, fontSize: 32, letterSpacing: -0.5 },
  lead: { margin: "10px 0 0", color: "rgba(255,255,255,0.74)", lineHeight: 1.6 },

  card: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 18
  },

  notice: {
    borderRadius: 16,
    padding: "12px 12px",
    marginBottom: 14,
    border: "1px solid rgba(255,255,255,0.12)"
  },
  noticeSuccess: { background: "rgba(34,197,94,0.10)", color: "rgba(255,255,255,0.92)" },
  noticeError: { background: "rgba(239,68,68,0.10)", color: "rgba(255,255,255,0.92)" },

  hpWrap: { position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" },

  section: { padding: "14px 0 10px", borderTop: "1px solid rgba(255,255,255,0.08)" },
  sectionTitle: { fontWeight: 800, marginBottom: 10, color: "rgba(255,255,255,0.90)" },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12
  },

  field: { display: "grid", gap: 6 },
  label: { fontSize: 13, color: "rgba(255,255,255,0.80)" },

  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none"
  },
  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,10,26,0.35)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical"
  },
  inputError: { border: "1px solid rgba(239,68,68,0.55)" },
  errorText: { fontSize: 12, color: "rgba(239,68,68,0.95)" },
  hint: { fontSize: 12, color: "rgba(255,255,255,0.60)" },

  checkboxRow: { display: "flex", alignItems: "flex-start", gap: 10, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 },

  actions: { marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  btn: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 26px rgba(31,79,216,.22)",
    cursor: "pointer"
  },
  btnDisabled: { opacity: 0.65, cursor: "not-allowed" },
  smallNote: { fontSize: 12, color: "rgba(255,255,255,0.60)" }
};
