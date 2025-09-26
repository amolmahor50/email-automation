import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthSteps } from "@/app/enum";

export function ForgotPassword() {
  const { setLoading, loading, setStep } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    console.log("forgot password =>", email);
  };

  return (
    <div className="max-w-sm mx-auto mt-8 md:mt-22">
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Forgot Password</Button>
      </form>
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
        onClick={() => setStep(AuthSteps.LOGIN)}
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>
    </div>
  );
}
