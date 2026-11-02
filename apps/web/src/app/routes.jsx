import { lazy } from "react";

const Home = lazy(() => import("../pages/Home.jsx"));
const Contact = lazy(() => import("../pages/Contact.jsx"));
const Groupe = lazy(() => import("../pages/Groupe.jsx"));
const Services = lazy(() => import("../pages/Services.jsx"));
const Realisations = lazy(() => import("../pages/Realisations.jsx"));
const Actualites = lazy(() => import("../pages/Actualites.jsx"));
const ActualiteDetail = lazy(() => import("../pages/ActualiteDetail.jsx"));
const Fondation = lazy(() => import("../pages/Fondation.jsx"));
const RealisationDetail = lazy(() => import("../pages/RealisationDetail.jsx"));

const AdminLogin = lazy(() => import("../components/admin/AdminLogin.jsx"));
const AdminQuotes = lazy(() => import("../components/admin/AdminQuotes.jsx"));
const RequireAdmin = lazy(() => import("../components/admin/RequireAdmin.jsx"));
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout.jsx"));
const AdminNews = lazy(() => import("../pages/admin/AdminNews.jsx"));
const AdminNewsForm = lazy(() => import("../pages/admin/AdminNewsForm.jsx"));
const AdminProjects = lazy(() => import("../pages/admin/AdminProjects.jsx"));
const AdminFoundation = lazy(() => import("../pages/admin/AdminFoundation.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const AdminProjectsForm = lazy(() => import("../pages/admin/AdminProjectsForm.jsx"));
const AdminFoundationForm = lazy(() => import("../pages/admin/AdminFoundationForm.jsx"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings.jsx"));



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
      { path: "settings", element: <AdminSettings /> },
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
