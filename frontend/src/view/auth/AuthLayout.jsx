import { Card } from "@/components/ui/card";
import { TypographyH5, TypographyH6 } from "@/components/custom/Typography";
import { useAuth } from "@/context/AuthContext";
import Copyright from "@/sections/Copyright";
import Version from "@/sections/Version";
import { APP_LOGO } from "@/app/path";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col gap-4">
        {/* Header / Logo */}
        <div className="flex justify-between items-center border-b p-4">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="md:w-10 w-8 flex items-center gap-2">
              <img src={APP_LOGO} alt="logo" />
            </div>
            <div className="flex flex-col font-bold text-[#006296]">
              <TypographyH6>Email</TypographyH6>
              <TypographyH5>Automation</TypographyH5>
            </div>
          </a>

          {/* User Info / Logout */}
          <div className="flex flex-col items-end">
            <p className="text-base capitalize">welcome</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 p-6">
          <div className="w-full max-w-2xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative flex flex-col items-center justify-center p-4 bg-secondary">
        <div className="max-w-lg space-y-6 z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Email Automation Made Simple
          </h1>
          <p className="text-sm lg:text-base leading-relaxed">
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
              <Card key={index} className="p-4 gap-0">
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div>
            <Copyright />
            <Version />
          </div>
        </div>
      </div>
    </div>
  );
}
