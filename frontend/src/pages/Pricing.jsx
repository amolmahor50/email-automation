import React from "react";
import { Check, Star, Zap, Crown, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "50 emails per month",
        "Basic templates library",
        "Document attachments",
        "Email history tracking",
        "Community support",
        "Basic email scheduling",
      ],
      limitations: [
        "No analytics dashboard",
        "Limited template customization",
        "No AI writing assistance",
      ],
      cta: "Get Started Free",
      popular: false,
      icon: Mail,
      color: "gray",
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For professionals and growing teams",
      features: [
        "500 emails per month",
        "Advanced analytics dashboard",
        "Email scheduling & automation",
        "Custom template creation",
        "AI writing assistance",
        "Priority email support",
        "Email open & click tracking",
        "Advanced personalization",
        "Custom email signatures",
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      icon: Star,
      color: "blue",
    },
    {
      name: "Business",
      price: "$49",
      period: "per month",
      description: "For businesses and agencies",
      features: [
        "5,000 emails per month",
        "Team collaboration tools",
        "Bulk email uploads (CSV)",
        "API access & integrations",
        "Custom branding options",
        "Dedicated account manager",
        "Advanced reporting & insights",
        "White-label solution",
        "GDPR compliance tools",
        "SSO integration",
        "Priority phone support",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      icon: Crown,
      color: "purple",
    },
  ];

  const features = [
    {
      category: "Email Management",
      items: [
        {
          name: "Monthly email limit",
          free: "50",
          pro: "500",
          business: "5,000",
        },
        {
          name: "Email templates",
          free: "Basic",
          pro: "Advanced + Custom",
          business: "Unlimited + Shared",
        },
        { name: "Email scheduling", free: "Basic", pro: "✓", business: "✓" },
        {
          name: "Bulk email sending",
          free: "✗",
          pro: "Limited",
          business: "✓",
        },
      ],
    },
    {
      category: "Analytics & Tracking",
      items: [
        { name: "Email history", free: "✓", pro: "✓", business: "✓" },
        { name: "Open & click tracking", free: "✗", pro: "✓", business: "✓" },
        { name: "Advanced analytics", free: "✗", pro: "✓", business: "✓" },
        { name: "Custom reports", free: "✗", pro: "✗", business: "✓" },
      ],
    },
    {
      category: "Collaboration & Support",
      items: [
        {
          name: "Team collaboration",
          free: "✗",
          pro: "Limited",
          business: "✓",
        },
        { name: "API access", free: "✗", pro: "Basic", business: "Full" },
        { name: "Priority support", free: "✗", pro: "✓", business: "✓" },
        { name: "Phone support", free: "✗", pro: "✗", business: "✓" },
      ],
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be billed pro-rata for any plan changes.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer:
        "Yes! We offer a 14-day free trial for both Pro and Business plans. No credit card required to start your trial.",
    },
    {
      question: "What happens if I exceed my email limit?",
      answer:
        "We'll notify you when you approach your limit. You can either upgrade your plan or wait until the next billing cycle. We never stop your service abruptly.",
    },
    {
      question: "Do you offer discounts for annual payments?",
      answer:
        "Yes! Save 20% when you pay annually. Annual plans also include additional features and priority support.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely. You can cancel your subscription at any time from your account settings. Your service will continue until the end of your current billing period.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and GDPR compliance to protect your data.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the perfect plan for your needs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core email
            automation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-2xl shadow-lg ${
                  plan.popular
                    ? "border-2 border-blue-500 scale-105"
                    : "border border-gray-200"
                } bg-white overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                      <Zap className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full bg-${plan.color}-100`}>
                      <Icon className={`w-8 h-8 text-${plan.color}-600`} />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li
                        key={limitIndex}
                        className="flex items-center opacity-60"
                      >
                        <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate("/signup")}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Features
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">
                    Free
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-blue-600 bg-blue-50 rounded-t-lg">
                    Pro
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr>
                      <td colSpan={4} className="py-6">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {category.category}
                        </h3>
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-gray-100">
                        <td className="py-4 px-6 text-gray-700">{item.name}</td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {item.free}
                        </td>
                        <td className="py-4 px-6 text-center bg-blue-50 text-gray-900">
                          {item.pro}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {item.business}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
