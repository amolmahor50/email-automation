import {
  TypographyH3,
  TypographyH6,
  TypographyH4,
  TypographyP,
} from "@/components/custom/Typography";
import PageLayout from "@/components/custom/PageLayout";
import { Facebook, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import Copyright from "@/sections/Copyright";

export default function Footer() {
  return (
    <footer className="py-12 bg-white border-t">
      <PageLayout>
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/logo.ico" alt="logo" className="w-10 md:w-12" />
              <div className="flex flex-col font-bold text-[#006296]">
                <TypographyH6>Email</TypographyH6>
                <TypographyH3>Automation</TypographyH3>
              </div>
            </div>
            <TypographyP className="text-sm text-gray-600">
              Explore the different versions of our Email Automation template.
            </TypographyP>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "API", "Integrations"],
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "Status", "Community"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Privacy"],
            },
          ].map((section) => (
            <div key={section.title}>
              <TypographyH4>{section.title}</TypographyH4>
              <ul className="space-y-4 mt-4 text-sm text-gray-500">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-[#006296] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col bg-[#f2f5fa] md:flex-row justify-between items-center gap-4 p-5 rounded-4xl">
          <Copyright />
          {/* Social Icons */}
          <div className="flex gap-8 text-gray-500">
            {[Facebook, Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-[#006296] hover:bg-[#006296] hover:text-white rounded-full p-2 transition-all"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </PageLayout>
    </footer>
  );
}
