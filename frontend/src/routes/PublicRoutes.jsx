import { Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "@/view/landing/LandingLayout";
import AuthLayout from "@/view/auth/AuthLayout";

export default function PublicRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingLayout />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthLayout />} />
    </Routes>
  );
}
