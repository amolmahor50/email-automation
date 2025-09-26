import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function ProtectedRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* <DashboardLayout /> */}
            <h1>View Dashboard</h1>
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} /> */}
      </Route>
    </Routes>
  );
}
