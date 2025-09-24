import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TypographyBlockquote,
  TypographyH1,
} from "@//components/custom/Typography";
import PageLayout from "@/components/custom/PageLayout";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <PageLayout className="mt-20  py-24 space-y-8 text-center">
      <div>
        <TypographyH1>Professional Email Automation</TypographyH1>
        <TypographyH1 className="mt-3">Made Simple</TypographyH1>
      </div>
      <TypographyBlockquote className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
        Streamline your email campaigns with smart templates, bulk sending,
        advanced analytics, and AI-powered writing assistance. Send personalized
        emails faster and track engagement effortlessly.
      </TypographyBlockquote>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate("login")}>Start Free Trial</Button>
        <Button variant="secondary">Watch Demo</Button>
      </div>
    </PageLayout>
  );
}
