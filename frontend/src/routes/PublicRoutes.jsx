import { Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "@/view/landing/LandingLayout";
import AuthLayout from "@/view/auth/AuthLayout";

import { LoginForm } from "@/view/auth/LoginForm";
import { RegisterForm } from "@/view/auth/RegisterForm";
import { ForgotPassword } from "@/view/auth/ForgotPassword";
import ResetPassword from "@/view/auth/ResetPassword";
import VerifyEmail from "@/view/auth/VerifyEmail";

import { PricingPlanes } from "@/view/auth/PricingPlanes";
import { PaymentForm } from "@/view/auth/PaymentForm";

const hasToken = () => !!localStorage.getItem("token");

export default function PublicRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingLayout />} />

      {/* Authentication Pages */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route
          path="login"
          element={
            !hasToken() ? <LoginForm /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="register"
          element={
            !hasToken() ? (
              <RegisterForm />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="forgot-password"
          element={
            !hasToken() ? (
              <ForgotPassword />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="reset-password/:token"
          element={
            !hasToken() ? (
              <ResetPassword />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="verify-email/:token"
          element={
            !hasToken() ? <VerifyEmail /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* Pricing Plans */}
        <Route
          path="pricing"
          element={
            !hasToken() ? (
              <PricingPlanes />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Payment Form */}
        <Route
          path="payment/:plan"
          element={
            !hasToken() ? <PaymentForm /> : <Navigate to="/dashboard" replace />
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
