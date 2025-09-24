import { version } from "@/../package.json";
import { Mail } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPassword } from "./ForgotPassword";
import { VerifyOtp } from "./VerifyOtp";
import { PaymentForm } from "./PaymentForm";
import { PricingPlanes } from "./PricingPlanes";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({ title = "Email Automation." }) {
  const { step } = useAuth();

  const renderStep = () => {
    switch (step) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      case "forgot-password":
        return <ForgotPassword />;
      case "verifyOtp":
        return <VerifyOtp />;
      case "pricingPlanes":
        return <PricingPlanes />;
      case "payment":
        return <PaymentForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-br from-blue-950 to-[#009896]">
      {/* Left Side */}
      <div className="flex flex-col gap-4 m-3 rounded-lg bg-white">
        {/* Header / Logo */}
        <div className="flex justify-between items-center border-b p-4">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex w-7 h-7 items-center justify-center rounded-md">
              <Mail className="w-5 h-5" />
            </div>
            {title}
          </a>

          {/* User Info / Logout */}
          <div className="flex flex-col items-end">
            <p className="text-sm capitalize">welcome</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 p-6">
          <div className="w-full max-w-2xl mx-auto">{renderStep()}</div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-lg space-y-6 z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Email Automation Made Simple
          </h1>
          <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
            Streamline your email campaigns with smart templates, bulk sending,
            advanced analytics, and AI-powered writing assistance. Send
            personalized emails faster and track engagement effortlessly.
          </p>

          {/* Features List */}
          <div className="md:grid hidden grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
            {[
              {
                title: "Smart Templates",
                description:
                  "Pre-built and custom templates for any email scenario.",
              },
              {
                title: "Bulk Email Sending",
                description:
                  "Send personalized emails to thousands with automation.",
              },
              {
                title: "Advanced Analytics",
                description: "Track opens, clicks, and engagement easily.",
              },
              {
                title: "Enterprise Security",
                description: "GDPR compliant and bank-level encryption.",
              },
              {
                title: "AI-Powered Writing",
                description: "Craft perfect emails with AI suggestions.",
              },
              {
                title: "Team Collaboration",
                description: "Manage team access and collaborate seamlessly.",
              },
            ].map((feature, index) => (
              <div key={index} className="p-4 bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-sm lg:text-base leading-relaxed mt-6 z-10 text-center lg:text-left">
            Copyright © 2024 EmailFlow. All rights reserved.
            <br />
            Version: {version}
          </p>
        </div>
      </div>
    </div>
  );
}
