import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthSteps } from "@/app/enum";

export function VerifyOtp() {
  const { setStep, isloading, setIsLoading, sendOtpEmail } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      alert("Please enter the full 6-digit OTP");
      return;
    }

    console.log("otp send successfull");
  };

  const handleResend = async () => {
    console.log("resend otp");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm lg:mt-16 mx-auto flex flex-col items-center space-y-6"
    >
      <div className="text-4xl text-blue-500">📩</div>
      <h2 className="sm:text-3xl text-2xl font-semibold tracking-tight mb-1">
        Verify your Email
      </h2>
      <p className="text-muted-foreground text-sm text-center">
        Enter the 6-digit verification code sent to your email.
        <br />
        <span className="font-semibold">{sendOtpEmail}</span>
      </p>

      <div className="flex space-x-2">
        {otp.map((digit, idx) => (
          <Input
            key={idx}
            type="text"
            maxLength={1}
            className="sm:w-10 w-9 sm:h-10 h-9 text-center border rounded-md text-xl"
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            ref={(el) => (inputRefs.current[idx] = el)}
          />
        ))}
      </div>

      <Button className="w-full" type="submit" disabled={isloading}>
        {isloading ? "Verifying..." : "Verify"}
      </Button>

      <div className="grid gap-4 w-full">
        <Button
          type="button"
          onClick={handleResend}
          variant="secondary"
          className="w-full"
          disabled={isloading}
        >
          Resend
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          type="button"
          onClick={() => setStep(AuthSteps.REGISTER)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
