import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm() {
  const { setStep } = useAuth();

  const [values, setValues] = useState({
    firstName: "",
    email: "",
    password: "",
    confPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    password: "",
    confPassword: "",
    terms: "",
    general: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Frontend Validation ---
    let hasError = false;
    let newErrors = {
      firstName: "",
      email: "",
      password: "",
      confPassword: "",
      terms: "",
      general: "",
    };

    if (!values.firstName.trim()) {
      newErrors.firstName = "First name is required";
      hasError = true;
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        newErrors.email = "Invalid email format";
        hasError = true;
      }
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!values.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (!strongPasswordRegex.test(values.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special char (min 8)";
      hasError = true;
    }

    if (!values.confPassword) {
      newErrors.confPassword = "Confirm your password";
      hasError = true;
    } else if (values.password !== values.confPassword) {
      newErrors.confPassword = "Passwords do not match";
      hasError = true;
    }

    if (!values.terms) {
      newErrors.terms = "You must accept terms";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }
  };

  return (
    <form
      className={cn("flex flex-col md:mt-16 gap-6 w-full max-w-sm mx-auto")}
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl text-center font-bold">Create a new account</h1>

      <div className="grid gap-4">
        {/* First Name */}
        <div className="grid gap-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-1 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-7 text-gray-500"
            onClick={() => setShowPass((v) => !v)}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-1 relative">
          <Label htmlFor="confPassword">Confirm Password</Label>
          <Input
            id="confPassword"
            name="confPassword"
            type={showConf ? "text" : "password"}
            value={values.confPassword}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-7 text-gray-500"
            onClick={() => setShowConf((v) => !v)}
          >
            {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confPassword && (
            <p className="text-red-500 text-sm">{errors.confPassword}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="terms"
            name="terms"
            checked={values.terms}
            onCheckedChange={(checked) =>
              setValues((v) => ({ ...v, terms: checked }))
            }
          />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>

      {/* Switch to login */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          className="underline underline-offset-4 font-semibold cursor-pointer"
          onClick={() => setStep("login")}
        >
          Login
        </button>
      </div>
    </form>
  );
}
