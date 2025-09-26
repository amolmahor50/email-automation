import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthSocial from "@/sections/AuthSocial";
import { login, getMe } from "@/api/auth";

// --- Validation Helper ---
const validateForm = ({ email, password }) => {
  const errors = { email: "", password: "", general: "" };

  if (!email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Invalid email format";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};

export function LoginForm() {
  const navigate = useNavigate();

  const { setStep } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // --- Handle Input ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "", general: "" }));
  };

  // --- Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await login(formData);
      console.log("Login success:", data);

      const user = await getMe();

      console.log("Current user:", user);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Login failed",
      }));
    }
  };

  return (
    <div className={cn("flex flex-col md:mt-14 max-w-sm mx-auto")}>
      <h1 className="text-2xl text-center font-bold mb-6">
        Login to your account
      </h1>

      {/* Social Auth */}
      <AuthSocial />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6">
          {/* Email */}
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm">
                {errors.password}
              </p>
            )}
          </div>

          {/* General error */}
          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>

        {/* Switch to register */}
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="underline font-semibold underline-offset-4"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
