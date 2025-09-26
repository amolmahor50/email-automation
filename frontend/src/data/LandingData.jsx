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

export const pricing = {
  heading: "The Affordable Unfair Advantage",
  caption:
    "Choose the plan that aligns with your Email Automation product requirements",
  features: [
    { id: 1, label: "50 emails per month" },
    { id: 2, label: "500 emails per month" },
    { id: 3, label: "5,000 emails per month" },
    { id: 4, label: "Basic templates library" },
    { id: 5, label: "Advanced + Custom templates" },
    { id: 6, label: "Unlimited + Shared templates" },
    { id: 7, label: "Email scheduling & automation" },
    { id: 8, label: "AI writing assistance" },
    { id: 9, label: "Advanced analytics & reports" },
    { id: 10, label: "Team collaboration tools" },
    { id: 11, label: "API access & integrations" },
    { id: 12, label: "Dedicated account manager" },
    { id: 13, label: "Priority support" },
  ],
  plans: [
    {
      name: "Free",
      price: 0,
      period: "mo",
      description: "Best for getting started with email automation",
      featuresID: [1, 4, 7],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: 49,
      period: "mo",
      description: "Perfect for professionals and growing teams",
      featuresID: [2, 5, 7, 8, 9, 13, 11],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Business",
      price: 99,
      period: "mo",
      description: "Best for businesses and agencies",
      featuresID: [3, 6, 7, 8, 9, 10, 11, 12, 13],
      cta: "Start Bussiness",
      popular: false,
    },
  ],
};

export const metricsData = {
  heading: "Endless Possibilities",
  caption: "We deliver measurable results across all our campaigns.",
  blockDetail: [
    {
      counter: 1200,
      defaultUnit: "+",
      caption: "Projects Completed",
    },
    {
      counter: 500,
      defaultUnit: "+",
      caption: "Happy Clients",
    },
    {
      counter: 75,
      defaultUnit: "%",
      caption: "Client Retention",
    },
    {
      counter: 2500,
      defaultUnit: "+",
      caption: "Emails Sent Daily",
    },
  ],
};

export const testimonials = [
  {
    name: "Amit Sharma",
    role: "Marketing Head",
    company: "NextGen Solutions",
    content:
      "EmailFlow has completely transformed the way we approach client communication. Earlier, following up with hundreds of leads was a manual and time-consuming task. With automation in place, our campaigns run seamlessly, ensuring every lead receives timely updates and personalized messages. This has directly improved our conversion rates and reduced manual errors.",
  },
  {
    name: "Priya Nair",
    role: "HR Manager",
    company: "PeopleFirst Consulting",
    content:
      "Recruitment emails used to take up half of my day. With EmailFlow, we now automate job role announcements, candidate reminders, and onboarding messages. The analytics feature is the cherry on top — it shows us how candidates interact with our mails, so we can refine our messaging for better engagement.",
  },
  {
    name: "Rohit Verma",
    role: "Founder",
    company: "StartupHub India",
    content:
      "As a founder, I juggle between multiple responsibilities. EmailFlow helps me maintain a professional presence without lifting a finger. From investor updates to customer newsletters, everything is automated yet still feels personal. I can focus on scaling the business instead of worrying about missed emails.",
  },
  {
    name: "Sneha Iyer",
    role: "Customer Success Lead",
    company: "CloudWorks",
    content:
      "Customer onboarding used to involve sending dozens of manual instructions and follow-ups. Now, with automation workflows, each customer gets guided emails step-by-step. It not only saves time but also ensures consistency. Our NPS scores have improved significantly since we started using EmailFlow.",
  },
  {
    name: "Ankit Gupta",
    role: "Freelance Consultant",
    company: "Independent",
    content:
      "As a consultant, I rely heavily on follow-up emails. EmailFlow ensures I never miss a touchpoint with clients. I’ve created sequences for proposals, payment reminders, and project updates — all running automatically. The professionalism it adds to my work has helped me secure repeat business effortlessly.",
  },
  {
    name: "Neha Kulkarni",
    role: "Product Manager",
    company: "InnoTech Labs",
    content:
      "Managing product updates and release notes used to be chaotic. With EmailFlow, our product communication is streamlined — every stakeholder receives clear, timely updates. The scheduling and analytics make it easy to plan campaigns and track user engagement. It feels like having an extra team member!",
  },
  {
    name: "Vikram Singh",
    role: "Sales Director",
    company: "GrowthMart",
    content:
      "Sales follow-ups are now smoother than ever. Earlier, our team spent hours drafting mails to prospects. With pre-designed templates and automated drip campaigns, EmailFlow keeps leads warm until they convert. Our pipeline looks healthier, and the team’s productivity has skyrocketed.",
  },
  {
    name: "Kavya Reddy",
    role: "Operations Head",
    company: "EduPrime",
    content:
      "In the education sector, communication with parents and students is critical. EmailFlow helps us send fee reminders, event updates, and progress reports automatically. Parents appreciate the timely notifications, and our staff is free to focus on more important tasks instead of chasing emails manually.",
  },
  {
    name: "Arjun Mehta",
    role: "Digital Marketer",
    company: "BrandBuzz Media",
    content:
      "Campaign reporting was always a headache. With EmailFlow, not only do we automate mailers, but we also track open rates, clicks, and conversions in real-time. This has helped us optimize our campaigns and show clear ROI to clients. It’s the smartest tool in our marketing stack.",
  },
  {
    name: "Ritika Das",
    role: "Entrepreneur",
    company: "Handmade Creations",
    content:
      "Running a small business means wearing many hats. I use EmailFlow to send thank-you messages, order confirmations, and product launch updates to my customers. It adds a professional touch without me spending hours writing mails. My customers often compliment the timely communication, which builds trust in my brand.",
  },
];
