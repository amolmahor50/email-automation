import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureCard from "@/components/landing/FeatureCard";
import PlanCard from "@/components/landing/PlanCard";
import TestimonialCard from "@/components/landing/TestimonialCard";
import Footer from "@/components/landing/Footer";
import PageLayout from "@/components/custom/PageLayout";
import { features, plans, testimonials } from "@/data/LandingData";
import { TypographyH1 } from "@/components/custom/Typography";

export default function LandingLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="features" className="py-16 bg-secondary">
        <PageLayout className="space-y-12">
          <TypographyH1 className="text-center">Features</TypographyH1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </PageLayout>
      </section>
      <section id="pricing" className="py-16">
        <PageLayout className="space-y-12">
          <TypographyH1 className="text-center">Plans</TypographyH1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <PlanCard key={i} {...p} />
            ))}
          </div>
        </PageLayout>
      </section>
      <section id="testimonials" className="py-16 bg-secondary">
        <PageLayout className="space-y-12">
          <TypographyH1 className="text-center">Testimonial</TypographyH1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
