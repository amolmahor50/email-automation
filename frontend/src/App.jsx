import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "@/view/layout/Layout";

// Pages
import Landing from "@/view/landing/Landing";
import AuthLayout from "@/view/auth/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import Templates from "@/pages/Templates";
import Compose from "@/pages/Compose";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";

// Admin Pages
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminUsers from "@/pages/Admin/Users";
import AdminRevenue from "@/pages/Admin/Revenue";
import AdminTemplates from "@/pages/Admin/Templates";
import AdminSettings from "@/pages/Admin/Settings";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Protected User/Admin Routes wrapped in Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
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
