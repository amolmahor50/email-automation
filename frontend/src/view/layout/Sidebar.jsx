"use client";

import {
  Home,
  FileText,
  Send,
  History,
  BarChart3,
  Settings,
  Users,
  DollarSign,
  Crown,
  Mail,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Logo, SmallLogo } from "@/sections/Logo";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems =
    user?.role === "admin"
      ? [
          { icon: Home, label: "Dashboard", path: "/admin" },
          { icon: Users, label: "Users", path: "/admin/users" },
          { icon: DollarSign, label: "Revenue", path: "/admin/revenue" },
          { icon: FileText, label: "Templates", path: "/admin/templates" },
          { icon: Settings, label: "Settings", path: "/admin/settings" },
        ]
      : [
          { icon: Home, label: "Dashboard", path: "/dashboard" },
          { icon: FileText, label: "Templates", path: "/templates" },
          { icon: Send, label: "Compose", path: "/compose" },
          { icon: History, label: "Email History", path: "/history" },
          { icon: BarChart3, label: "Analytics", path: "/analytics" },
          { icon: Settings, label: "Profile", path: "/profile" },
        ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/25 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white w-64 border-r transform transition-transform duration-200 z-50 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header with close button */}
        <div className="flex justify-between border-b items-center p-4 md:hidden">
          <SmallLogo />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        {/* Logo for desktop */}
        <div className="hidden md:flex items-center p-6">
          <Logo />
        </div>

        <Separator className="hidden md:block my-2" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start hover:bg-primary/20 gap-3 text-sm rounded-lg ${
                      isActive(item.path)
                        ? "bg-primary/40 text-primary border-r-2 border-primary"
                        : "text-gray-600 hover:bg-primary/20 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>

          {/* Upgrade Banner */}
          {user?.role === "user" && user.subscription.plan === "free" && (
            <div className="mt-8 px-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-4 text-white flex flex-col space-y-2">
                <Crown className="w-6 h-6" />
                <div className="font-semibold text-sm">Upgrade to Pro</div>
                <div className="text-xs opacity-90">
                  Unlock analytics, scheduling, and more templates.
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full  mt-2"
                  onClick={() => {
                    navigate("/subscription");
                    setIsOpen(false);
                  }}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;
