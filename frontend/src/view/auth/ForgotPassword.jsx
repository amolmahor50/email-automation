import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { forgotPassword } from "@/api/auth";

export function ForgotPassword() {
  const navigate = useNavigate();

  const { setLoading, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset email sent ✅");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send reset email ❌"
      );
    } finally {
      setLoading(false);
    }
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
        onClick={() => navigate("login")}
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>
    </div>
  );
}
