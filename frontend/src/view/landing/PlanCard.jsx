import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PlanCard({
  name,
  price,
  period,
  description,
  featuresID,
  cta,
  popular,
  allFeatures,
}) {
  return (
    <div
      className={`rounded-4xl p-8 relative ${
        popular
          ? "bg-blue-50 border-2 border-blue-500"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      {/* Most Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">₹{price}</span>
          <span className="text-gray-600">/{period}</span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {allFeatures.map((feature, index) => {
          const included = featuresID.includes(feature.id);
          return (
            <li
              key={index}
              className={`flex text-sm tracking-normal items-center ${
                included ? "" : "text-gray-400"
              }`}
            >
              {included ? (
                <Check size={16} className="mr-3 flex-shrink-0" />
              ) : (
                <X size={16} className="text-gray-400 mr-3 flex-shrink-0" />
              )}
              <span>{feature.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Button */}
      <Link to="/login">
        <Button
          className={`w-full transition-colors ${
            popular
              ? "bg-blue-600 hover:bg-blue-700 animate-pulse"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
