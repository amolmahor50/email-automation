import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
}) {
  return (
    <div
      className={`rounded-xl p-8 ${
        popular
          ? "bg-blue-50 border-2 border-blue-500 relative"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">/{period}</span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full transition-colors ${
          popular && "bg-blue-600  hover:bg-blue-700"
        }`}
      >
        {cta}
      </Button>
    </div>
  );
}
