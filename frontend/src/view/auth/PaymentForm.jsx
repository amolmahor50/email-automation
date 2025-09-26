import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TypographyH3,
  TypographyMuted,
  TypographyH5,
} from "@/components/custom/Typography";
import {
  CreditCard,
  Calendar,
  Shield,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function PaymentForm() {
  const { setStep, selectedPlan, logout, localStorageSet } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Determine if the plan is free
  const isFreePlan = selectedPlan?.price === 0;

  const handleSkipPlan = async () => {
    console.log("skiped button click");
  };

  return (
    <div className="w-full mx-auto max-w-xs flex flex-col gap-4">
      <TypographyH3>Payments</TypographyH3>
      <TypographyMuted>
        Review your selected plan before completing the payment.
      </TypographyMuted>

      {selectedPlan && (
        <TypographyH5 className="text-indigo-600">
          {selectedPlan.name} - ₹{selectedPlan.price}/{selectedPlan.period}
        </TypographyH5>
      )}

      {isFreePlan ? (
        // For free plan, just show Skip button
        <Button
          variant="secondary"
          className="w-full mt-4"
          onClick={handleSkipPlan}
        >
          Skip Payment
        </Button>
      ) : (
        // For paid plan, show payment form
        <form className="space-y-4">
          {/* Cardholder Name */}
          <div className="grid gap-1">
            <Label>Cardholder Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Card Number */}
          <div className="grid gap-1">
            <Label>Card Number</Label>
            <div className="relative">
              <Input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 1234 5678"
                value={formData.cardNumber}
                onChange={handleChange}
              />
              <CreditCard
                size={18}
                className="absolute top-2 right-3 text-gray-400"
              />
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="flex gap-4">
            <div className="w-1/2 grid gap-1">
              <Label>Expiry Date</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                />
                <Calendar
                  size={18}
                  className="absolute top-2 right-3 text-gray-400"
                />
              </div>
            </div>
            <div className="w-1/2 grid gap-1">
              <Label>CVV</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                />
                <Shield
                  size={18}
                  className="absolute top-2 right-3 text-gray-400"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Pay - {selectedPlan?.price}
          </Button>
        </form>
      )}

      <div className="flex justify-between mt-2">
        <Button
          onClick={() => setStep("pricingPlanes")}
          variant="outline"
          className="w-fit"
        >
          <SkipBack /> Back
        </Button>
        {!isFreePlan && (
          <Button
            onClick={handleSkipPlan}
            variant="secondary"
            className="w-fit"
          >
            <SkipForward /> Skip
          </Button>
        )}
      </div>
    </div>
  );
}
