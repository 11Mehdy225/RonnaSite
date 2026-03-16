import { Routes, Route ,useLocation} from "react-router-dom";
import { routes } from "./routes.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import MentionsLegales from "../pages/MentionsLegales.jsx"
import ScrollToTop from "../components/utils/ScrollToTop.jsx";
import { Helmet } from "react-helmet-async";


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
    <>
    <Helmet>
        <title>Ronna Group</title>
        <meta
          name="description"
          content="Ronna Group – Groupe d’investissement et actions solidaires en Côte d’Ivoire."
        />
      </Helmet>
    {!isAdmin && <Navbar />}
      {/* <Navbar /> */}
      <ScrollToTop />
      <Routes>
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        {renderRoutes(routes)}
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}
