import { useState } from "react";

// shadcn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH4 } from "@/components/custom/Typography";

// icons
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";

// data
import { pricing } from "@/data/LandingData";

// context
import { useAuth } from "@/context/AuthContext";

export function PricingPlanes() {
  const { setStep, setSelectedPlan } = useAuth();
  const [expandedPlan, setExpandedPlan] = useState(null);

  const toggleExpand = (planName) => {
    setExpandedPlan(expandedPlan === planName ? null : planName);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    console.log("Selected Plan:", plan);
    setStep("payment"); // go to payment after plan selection
  };

  return (
    <div className="grid gap-6 text-center w-full">
      {/* Heading */}
      <div className="space-y-2">
        <TypographyH1>{pricing.heading}</TypographyH1>
        <p className="text-muted-foreground">{pricing.caption}</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {pricing.plans.map((plan) => {
          const planFeatures = pricing.features.filter((f) =>
            plan.featuresID.includes(f.id)
          );

          const isExpanded = expandedPlan === plan.name;

          return (
            <Card
              key={plan.name}
              className={`p-6 flex flex-col gap-4 border transition-all cursor-pointer 
                ${
                  plan.popular
                    ? "border-indigo-600 shadow-md"
                    : "border-gray-200"
                }`}
            >
              {/* Plan Info */}
              <div>
                <TypographyH4>{plan.name}</TypographyH4>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
                <p className="font-semibold text-2xl mt-2">
                  ₹{plan.price} <span className="text-sm">/{plan.period}</span>
                </p>
              </div>

              {/* Features */}
              <ul className="grid gap-2 text-sm text-muted-foreground text-left">
                {(isExpanded ? planFeatures : planFeatures.slice(0, 3)).map(
                  (feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <CheckIcon className="mt-1 h-4 w-4 text-indigo-600" />
                      <span>{feature.label}</span>
                    </li>
                  )
                )}
              </ul>

              {/* Show More / Less */}
              {planFeatures.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full rounded-full flex items-center justify-center gap-1"
                  onClick={() => toggleExpand(plan.name)}
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown size={16} />
                    </>
                  )}
                </Button>
              )}

              {/* CTA */}
              <Button
                onClick={() => handleSelectPlan(plan)}
                className="w-full mt-4"
              >
                {plan.cta}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
