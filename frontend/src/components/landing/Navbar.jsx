"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Helper to navigate AND close mobile menu
  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path) navigate(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">EmailFlow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Reviews
            </a>
            <Button onClick={() => handleNavClick("/auth")}>Get Started</Button>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white/90 backdrop-blur-xl shadow-lg`}
      >
        <div className="flex flex-col items-center space-y-6 py-6">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Reviews
          </a>
          <Button onClick={() => handleNavClick("/auth")} className="w-40">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
