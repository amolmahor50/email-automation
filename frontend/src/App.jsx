import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "@/view/layout/Layout";

// Pages
import Landing from "@/view/landing/Landing";
import AuthLayout from "@/view/auth/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import Compose from "@/pages/Compose";
import History from "@/pages/History";
import TemplatesList from "@/pages/templates/TemplatesList";
import CreateTemplate from "@/pages/templates/CreateTemplate";
import EditTemplate from "@/pages/templates/EditTemplate";
import PreviewTemplate from "@/pages/templates/PreviewTemplate";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";

// Admin Pages
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminUsers from "@/pages/Admin/Users";
import AdminRevenue from "@/pages/Admin/Revenue";
import AdminTemplates from "@/pages/Admin/Templates";
import AdminSettings from "@/pages/Admin/Settings";

import { useAuth } from "@/contexts/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Smart root route */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          ) : (
            <Landing />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<TemplatesList />} />
        <Route path="/templates/create" element={<CreateTemplate />} />
        <Route path="/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/templates/:id/preview" element={<PreviewTemplate />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Pricing />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <ProtectedRoute requireAdmin>
              <AdminRevenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/templates"
          element={
            <ProtectedRoute requireAdmin>
              <AdminTemplates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requireAdmin>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
