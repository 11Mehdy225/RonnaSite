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
const AuditExpress = lazy(() => import("../pages/AuditExpress.jsx"));

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
const AdminMedia = lazy(() => import("../pages/admin/AdminMedia.jsx"));
const AdminActivity = lazy(() => import("../pages/admin/AdminActivity.jsx"));
const AdminForgotPassword = lazy(() => import("../pages/admin/AdminForgotPassword.jsx"));
const AdminResetPassword = lazy(() => import("../pages/admin/AdminResetPassword.jsx"));



export const routes = [
  { path: "/", element: <Home /> },
   // ADMIN
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/forgot-password", element: <AdminForgotPassword /> },
  { path: "/admin/reset-password", element: <AdminResetPassword /> },
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
      { path: "media", element: <AdminMedia /> },
      { path: "activity", element: <AdminActivity /> },
    ]
  },

  { path: "/groupe", element: <Groupe /> },
  { path: "/services", element: <Services /> },
  { path: "/actualites", element: <Actualites /> },
  { path: "/actualites/:slug", element: <ActualiteDetail /> },
  { path: "/realisations", element: <Realisations /> },
  { path: "/realisations/:slug", element: <RealisationDetail /> },
  { path: "/audit-express", element: <AuditExpress /> },
  { path: "/contact", element: <Contact /> },
  { path: "/fondation", element: <Fondation /> }
];
