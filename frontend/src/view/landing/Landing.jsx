import Navbar from "@/view/landing/Navbar";
import Hero from "@/view/landing/Hero";
import FeatureCard from "@/view/landing/FeatureCard";
import PlanCard from "@/view/landing/PlanCard";
import TestimonialCard from "@/view/landing/TestimonialCard";
import Footer from "@/view/landing/Footer";
import Metrics from "@/view/landing/Metrics";
import PageLayout from "@/components/custom/PageLayout";
import {
  features,
  pricing,
  testimonials,
  metricsData,
} from "@/data/LandingData";
import { TypographyH1, TypographyLead } from "@/components/custom/Typography";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="features" className="space-y-12 py-12">
        <TypographyH1 className="text-center max-w-2xl mx-auto">
          Comprehensive Features Tailored to your Need
        </TypographyH1>
        <PageLayout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 bg-[#f2f5fa] rounded-4xl p-12">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </PageLayout>
      </section>
      <section id="metrics">
        <PageLayout>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">{metricsData.heading}</h2>
            <TypographyLead>{metricsData.caption}</TypographyLead>
          </div>
          <Metrics blockDetail={metricsData.blockDetail} />
        </PageLayout>
      </section>
      <section id="pricing" className="py-20">
        <PageLayout className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">{pricing.heading}</h2>
            <TypographyLead>{pricing.caption}</TypographyLead>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {pricing.plans.map((plan, index) => (
              <PlanCard key={index} {...plan} allFeatures={pricing.features} />
            ))}
          </div>
        </PageLayout>
      </section>
      <section id="testimonials" className="py-16">
        <PageLayout className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              See What Our Customers Are Saying
            </h2>
            <TypographyLead>
              Trusted by thousands of users worldwide, hear how Phoenixcoded
              helps bring their projects to life.
            </TypographyLead>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </PageLayout>
      </section>
      <Footer />
    </div>
  );
}
