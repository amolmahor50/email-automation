import { Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "@/components/landing/LandingLayout";
import AuthLayout from "./components/authLayout/AuthLayout";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingLayout />} />
        <Route path="/auth" element={<AuthLayout />} />
      </Routes>
    </div>
  );
}
