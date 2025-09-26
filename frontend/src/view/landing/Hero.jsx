import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TypographyBlockquote,
  TypographyH1,
} from "@//components/custom/Typography";
import PageLayout from "@/components/custom/PageLayout";
import { ExternalLink, LogIn } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <PageLayout className="mt-16 md:mt-20 py-24 space-y-8">
        <div className="max-w-3xl mx-auto">
          <TypographyH1 className="sm:text-6xl font-semibold">
            Professional{" "}
            <span className="text-[#006296]">Email Automation</span> Made Simple
          </TypographyH1>
        </div>
        <TypographyBlockquote className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Streamline your email campaigns with smart templates, bulk sending,
          advanced analytics, and AI-powered writing assistance. Send
          personalized emails faster and track engagement effortlessly.
        </TypographyBlockquote>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="py-6 w-full rounded-full">
              Start Free Trial
              <LogIn />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="bg-[#006296] rounded-full py-6 text-white hover:bg-[#006296] hover:text-white"
          >
            How Can Used
            <ExternalLink />
          </Button>
        </div>
      </PageLayout>
    </section>
  );
}
