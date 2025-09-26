import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthSocial from "@/sections/AuthSocial";
import { AuthSteps } from "@/app/enum";

// --- Validation Helper ---
const validateForm = (values) => {
  const errors = {
    name: "",
    email: "",
    password: "",
    confPassword: "",
    terms: "",
    general: "",
  };

  if (!values.name.trim()) errors.name = "Name is required";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Invalid email format";

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!values.password) errors.password = "Password is required";
  else if (!strongPasswordRegex.test(values.password))
    errors.password =
      "Password must have uppercase, lowercase, number, special char (min 8)";

  if (!values.confPassword) errors.confPassword = "Confirm your password";
  else if (values.password !== values.confPassword)
    errors.confPassword = "Passwords do not match";

  if (!values.terms) errors.terms = "You must accept terms";

  return errors;
};

export function RegisterForm() {
  const { setStep, setSendOtpEmail, loading, setLoading } = useAuth();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({
    name: "",
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
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(values);
    const hasError = Object.values(validationErrors).some((err) => err !== "");
    if (hasError) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const data = {
      email: values.email,
      name: values.name,
      password: values.password,
    };

    console.log("registation succesfull", data);
  };

  return (
    <div className={cn("flex flex-col md:mt-12 w-full max-w-sm mx-auto")}>
      <h1 className="text-2xl text-center font-bold mb-6">
        Create a new account
      </h1>
      <AuthSocial />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm">
                {errors.name}
              </p>
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
          <div className="grid gap-1 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              className="pr-10"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
            <button
              type="button"
              className="absolute right-3 top-7 text-gray-500"
              onClick={() => setShowPass((prev) => !prev)}
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
              aria-invalid={!!errors.confPassword}
              aria-describedby="confPassword-error"
            />
            <button
              type="button"
              className="absolute right-3 top-7 text-gray-500"
              onClick={() => setShowConf((prev) => !prev)}
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
                setValues((v) => ({ ...v, terms: Boolean(checked) }))
              }
            />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm">{errors.terms}</p>
          )}

          {/* General error */}
          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending OTP..." : "Continue"}
          </Button>
        </div>

        {/* Switch to login */}
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="underline underline-offset-4 font-semibold"
            onClick={() => setStep(AuthSteps.LOGIN)}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
