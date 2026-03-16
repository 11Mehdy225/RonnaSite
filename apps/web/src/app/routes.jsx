import Home from "../pages/Home.jsx";
import Contact from "../pages/Contact.jsx";
import Groupe from "../pages/Groupe.jsx";
import Services from "../pages/Services.jsx";
import Realisations from "../pages/Realisations.jsx";
import Actualites from "../pages/Actualites.jsx";
import ActualiteDetail from "../pages/ActualiteDetail.jsx";
import Fondation from "../pages/Fondation.jsx";
import RealisationDetail from "../pages/RealisationDetail.jsx";

import AdminLogin from "../components/admin/AdminLogin.jsx";
import AdminQuotes from "../components/admin/AdminQuotes.jsx";
import RequireAdmin from "../components/admin/RequireAdmin.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminNews from "../pages/admin/AdminNews.jsx";
import AdminNewsForm from "../pages/admin/AdminNewsForm.jsx";
import AdminProjects from "../pages/admin/AdminProjects.jsx";
import AdminFoundation from "../pages/admin/AdminFoundation.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProjectsForm from "../pages/admin/AdminProjectsForm.jsx";
import AdminFoundationForm from "../pages/admin/AdminFoundationForm.jsx";



export const routes = [
  { path: "/", element: <Home /> },
   // ADMIN
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "quotes", element: <AdminQuotes /> },
      { path: "news", element: <AdminNews /> },
      { path: "news/new", element: <AdminNewsForm mode="create" /> },
      { path: "news/:id/edit", element: <AdminNewsForm mode="edit" /> },
      { path: "projects", element: <AdminProjects /> },
      { path: "projects/new", element: <AdminProjectsForm mode="create" /> },
      { path: "projects/:id/edit", element: <AdminProjectsForm mode="edit" /> },
      { path: "foundation", element: <AdminFoundation /> },
      { path: "foundation/new", element: <AdminFoundationForm mode="create" /> },
      { path: "foundation/:id/edit", element: <AdminFoundationForm mode="edit" /> },
    ]
  },

  { path: "/groupe", element: <Groupe /> },
  { path: "/services", element: <Services /> },
  { path: "/actualites", element: <Actualites /> },
  { path: "/actualites/:slug", element: <ActualiteDetail /> },
  { path: "/realisations", element: <Realisations /> },
  { path: "/realisations/:slug", element: <RealisationDetail /> },
  { path: "/contact", element: <Contact /> },
  { path: "/fondation", element: <Fondation /> }
];
