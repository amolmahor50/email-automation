import { Routes, Route } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import NotFound from "@/view/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Protected */}
      <Route path="/dashboard/*" element={<ProtectedRoutes />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
