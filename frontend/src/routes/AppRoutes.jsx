import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import ProjectsPage from "../pages/Projects";
import ProjectPage from "../pages/Project";
import BlogsPage from "../pages/Blogs";
import BlogPage from "../pages/Blog";
import CertificatesPage from "../pages/Certificates";
import ContactPage from "../pages/Contact";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminLogin from "../pages/admin/Login";
import AdminSettings from "../pages/admin/Settings";
import AdminProjects from "../pages/admin/Projects";
import AdminBlogs from "../pages/admin/Blogs";
import AdminSkills from "../pages/admin/Skills";
import AdminExperience from "../pages/admin/Experience";
import AdminCertificates from "../pages/admin/Certificates";
import AdminMessages from "../pages/admin/Messages";
import AdminResume from "../pages/admin/Resume";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:id" element={<BlogPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="resume" element={<AdminResume />} />
      </Route>
    </Routes>
  );
}