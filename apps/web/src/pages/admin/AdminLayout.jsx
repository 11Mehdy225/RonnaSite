import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import { adminLogout } from "../../lib/adminApi.js";



const NAV = [
  { to: "/admin", label: "Dashboard", group: "Général" },
  { to: "/admin/quotes", label: "Demandes de devis", group: "Demandes" },
  { to: "/admin/news", label: "Actualités", group: "Contenu" },
  { to: "/admin/projects", label: "Réalisations", group: "Contenu" },
  { to: "/admin/foundation", label: "Fondation", group: "Contenu" },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const [me, setMe] = useState(null); // {sub,email,role}
  const [loadingMe, setLoadingMe] = useState(true);

  const goSite = () => nav("/", { replace: true });

  const fetchMe = async () => {
    setLoadingMe(true);
    try {
      const res = await fetch("/api/admin/auth/me", { credentials: "include" });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.ok !== true) {
        // cookie absent/expiré
        nav("/admin/login", { replace: true });
        return;
      }
      setMe(json.user || null);
    } catch {
      // si l’API ne répond pas : on renvoie login (ou tu peux afficher un message)
      nav("/admin/login", { replace: true });
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const logout = async () => {
  //   try {
  //     await fetch("/api/admin/auth/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //   } catch {
  //     // ignore
  //   } finally {
  //     nav("/admin/login", { replace: true });
  //   }
  // };
  
  
  const logout = async () => {
  try { await adminLogout(); } catch (err){console.log(err)}
  nav("/admin/login", { replace: true });
};

  return (
    <div className="rgAdminShell" style={styles.shell}>
      <aside className="rgAdminSidebar" style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandTop}>RONNA</div>
          <div style={styles.brandSub}>Dashboard Admin</div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Demandes</div>
          <nav className="rgAdminNav" style={styles.nav}>
            {NAV.filter((x) => x.group === "Demandes").map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Contenu</div>
          <nav className="rgAdminNav" style={styles.nav}>
            {NAV.filter((x) => x.group === "Contenu").map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </div>

        <div style={styles.sideFooter}>
          <button type="button" style={styles.btnGhost} onClick={goSite}>
            Voir le site
          </button>

          <button type="button" style={styles.btnDanger} onClick={logout}>
            Déconnexion
          </button>

          <div style={styles.small}>
            {loadingMe ? (
              <span>Session…</span>
            ) : (
              <>
                Connecté : <strong>{me?.email || "—"}</strong>{" "}
                <span style={{ opacity: 0.7 }}>({me?.role || "ADMIN"})</span>
              </>
            )}
          </div>
        </div>
      </aside>

      <div style={styles.right}>
        <div style={styles.dashboardSticky}>
          <AdminDashboard />
        </div>

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .rgAdminLink:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04);
        }
        .rgAdminLink:active { transform: translateY(0px); }

        @media (max-width: 980px) {
          .rgAdminShell { grid-template-columns: 1fr !important; }
          .rgAdminSidebar {
            position: sticky;
            top: 0;
            z-index: 40;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.10) !important;
          }
          .rgAdminNav {
            display: flex !important;
            gap: 8px !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
          }
          .rgAdminLink { white-space: nowrap; }
        }
      `}</style>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className="rgAdminLink"
      style={({ isActive }) => ({
        ...styles.link,
        ...(isActive ? styles.linkActive : null),
      })}
    >
      {label}
    </NavLink>
  );
}

const styles = {
  right: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },

  dashboardSticky: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,10,26,0.72)",
    backdropFilter: "blur(12px)",
  },

  shell: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    borderRight: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,10,26,0.55)",
    backdropFilter: "blur(12px)",
    padding: 14,
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  brand: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
    marginBottom: 12,
  },
  brandTop: {
    fontWeight: 950,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.92)",
  },
  brandSub: { marginTop: 4, color: "rgba(255,255,255,0.65)", fontSize: 12 },

  section: { marginTop: 10 },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    padding: "6px 6px",
  },

  nav: { display: "grid", gap: 8 },

  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.86)",
    textDecoration: "none",
    transition: "transform .12s ease, background .12s ease, border-color .12s ease",
  },
  linkActive: {
    background: "rgba(31,79,216,0.16)",
    borderColor: "rgba(31,79,216,0.35)",
  },

  sideFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    gap: 10,
  },

  btnGhost: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
  },
  btnDanger: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 16,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.28)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },

  small: { fontSize: 12, color: "rgba(255,255,255,0.60)", textAlign: "center" },

  main: { padding: "18px 18px 60px" },
};