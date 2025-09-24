import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ForgotPassword() {
  const { setStep } = useAuth();

  const [step, setStepLocal] = useState("enterEmail");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setMessage("Please enter all 6 digits of the OTP");
      return;
    }
  };

  // Step 3: Reset Password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confPassword) {
      setMessage("Passwords do not match");
      return;
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 md:mt-22">
      {step === "enterEmail" && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Send OTP</Button>
        </form>
      )}

      {step === "verifyOtp" && (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
          <div className="flex space-x-2 justify-center">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                type="text"
                maxLength={1}
                className="w-10 h-10 text-center text-xl"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                ref={(el) => (inputRefs.current[idx] = el)}
              />
            ))}
          </div>
          <Button type="submit">Verify OTP</Button>
        </form>
      )}

      {step === "resetPassword" && (
        <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <Label>New Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      )}

      {message && (
        <p
          className={`text-sm mt-2 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={() => setStep("login")}
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>
    </div>
  );
}
