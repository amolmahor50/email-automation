import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function VerifyOtp() {
  const { setStep } = useAuth();
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

  return (
    <form className="w-full max-w-sm lg:mt-20 mx-auto flex flex-col items-center space-y-6">
      <div className="text-4xl text-blue-500">📩</div>
      <h2 className="sm:text-3xl text-2xl font-semibold tracking-tight mb-1">
        Verify your Email
      </h2>
      <p className="text-muted-foreground text-sm text-center">
        Enter the 6-digit verification code sent to your email.
        <br />
        <span className="font-semibold">amolmahor50@gmail.com</span>
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

      <Button className="w-full" type="submit">
        Verify
      </Button>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          type="button"
          onClick={handleResend}
          variant="outline"
          className="w-full"
        >
          Resend
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={() => setStep("register")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
