import { Suspense, lazy } from "react";
import { Routes, Route ,useLocation} from "react-router-dom";
import { routes } from "./routes.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ScrollToTop from "../components/utils/ScrollToTop.jsx";
import { Helmet } from "react-helmet-async";
import DataVortexBackground from "../components/background/DataVortexBackground.jsx";
import AnalyticsTracker from "../components/utils/AnalyticsTracker.jsx";

const MentionsLegales = lazy(() => import("../pages/MentionsLegales.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));


// function renderRoutes(list) {
//   return list.map((r) => (
//     <Route key={r.path} path={r.path} element={r.element}>
//       {r.children ? renderRoutes(r.children) : null}
//     </Route>
//   ));
// }

function renderRoutes(list, parentKey = "") {
  return list.map((r, idx) => {
    const key = `${parentKey}${r.index ? "index" : (r.path || "no-path")}-${idx}`;

    return (
      <Route
        key={key}
        path={r.index ? undefined : r.path}
        index={Boolean(r.index)}
        element={r.element}
      >
        {r.children ? renderRoutes(r.children, `${key}/`) : null}
      </Route>
    );
  });
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className={isAdmin ? "rgAdminApp" : "rgPublicShell"}>
    <Helmet>
        <title>Ronna Group</title>
        <meta
          name="description"
          content="Ronna Group – Groupe d’investissement et actions solidaires en Côte d’Ivoire."
        />
      </Helmet>
    {!isAdmin && <DataVortexBackground />}
    <div id={!isAdmin ? "contenu-principal" : undefined} className={isAdmin ? undefined : "rgPublicContent"}>
    {!isAdmin && <a className="rg-skip-link" href="#contenu-principal">Aller au contenu</a>}
    {!isAdmin && <Navbar />}
      {/* <Navbar /> */}
      <ScrollToTop />
      <AnalyticsTracker />
      <Suspense fallback={<div className="rg-page-loader" role="status">Chargement…</div>}>
        <Routes>
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          {renderRoutes(routes)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </div>
    </div>
  );
}
