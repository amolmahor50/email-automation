import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/custom/PageLayout";
import { HiMenu, HiX } from "react-icons/hi";
import { TbExternalLinkOff } from "react-icons/tb";
import { Logo } from "@/sections/Logo";

const links = ["Home", "Features", "Pricing", "Reviews"];

export default function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-gray-50"
      }`}
    >
      <PageLayout className="flex justify-between h-18 md:h-24 items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2 bg-[#ebeef2] rounded-full">
          {links.map((link) => (
            <Link
              key={link}
              className="text-sm py-2.5 rounded-full hover:bg-[#D9E9CF] transition-all px-5"
              to={`#${link.toLowerCase()}`}
            >
              {link}
            </Link>
          ))}
          <Link
            to="/docs"
            className="text-sm py-2.5 flex items-center gap-1 rounded-full hover:bg-[#D9E9CF] transition-all px-5"
          >
            Docs
            <TbExternalLinkOff />
          </Link>
        </div>

        {/* Desktop Login Button */}
        <div className="hidden md:block">
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={handleDrawerToggle} className="text-2xl">
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </PageLayout>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white w-full shadow-md absolute top-18 left-0 flex flex-col items-center gap-4 py-5">
          {links.map((link) => (
            <Link
              key={link}
              className="text-sm py-2.5 rounded-full hover:bg-[#D9E9CF] transition-all px-5 w-full text-center"
              to={`#${link.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </Link>
          ))}
          <Link
            to="/docs"
            className="text-sm py-2.5 flex items-center gap-1 rounded-full hover:bg-[#D9E9CF] transition-all px-5"
          >
            Docs
            <TbExternalLinkOff />
          </Link>
          <Button
            onClick={() => {
              navigate("/auth");
              setMobileOpen(false);
            }}
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
}
