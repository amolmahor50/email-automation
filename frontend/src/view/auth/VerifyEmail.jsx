import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/auth";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return setStatus("Invalid token");
    verifyEmail(token)
      .then(() => setStatus("Email verified successfully!"))
      .catch(() => setStatus("Verification failed"));
  }, [params]);

  return <h2>{status}</h2>;
}
