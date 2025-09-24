import { Mail, Send, BarChart3, Shield, Zap, Users } from "lucide-react";

export const features = [
  {
    icon: Mail,
    title: "Smart Templates",
    description:
      "Pre-built and custom email templates for every scenario. AI-powered suggestions for better content. Save time with reusable templates. Optimize your email workflow easily.",
  },
  {
    icon: Send,
    title: "Bulk Email Sending",
    description:
      "Send personalized emails to thousands of recipients with advanced scheduling and automation. Manage email lists efficiently. Track delivery and bounce rates. Automate follow-ups to increase engagement.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track opens, clicks, and engagement with detailed reporting. Gain insights to improve email performance. Monitor trends over time. Make data-driven decisions to boost ROI.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption to keep your emails safe. Fully GDPR compliant. Secure document storage for attachments. Protect sensitive data with robust access controls.",
  },
  {
    icon: Zap,
    title: "AI-Powered Writing",
    description:
      "Let AI help you craft the perfect email with grammar checks. Suggests tone and style improvements. Generate content faster. Ensure professional communication every time.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share templates and manage team access seamlessly. Collaborate on campaigns in real-time. Track individual contributions. Streamline communication across your team.",
  },
];

export const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "50 emails per month",
      "Basic templates",
      "Document attachments",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals",
    features: [
      "500 emails per month",
      "Advanced analytics",
      "Email scheduling",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For businesses",
    features: [
      "5000 emails per month",
      "Team collaboration",
      "Bulk email uploads",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    company: "TechCorp",
    content: "EmailFlow has transformed how we handle client communications.",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Independent",
    content: "Helps me maintain professional communication effortlessly.",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    company: "StartupXYZ",
    content: "Analytics features help us understand engagement better.",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
];
