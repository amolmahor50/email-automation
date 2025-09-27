import { Bell, Menu, Search, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-muted px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Left: Mobile menu & search */}
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-8 h-8 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-card text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <button className="flex items-center space-x-2 focus:outline-none">
              <Avatar>
                {user?.profile?.profilePicture ? (
                  <AvatarImage src={user.profile.profilePicture} />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.subscription?.plan}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Profile Info */}
            <div className="p-2 flex items-center space-x-3">
              <Avatar>
                {user?.profile?.profilePicture ? (
                  <AvatarImage src={user.profile.profilePicture} />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>

            {/* Dropdown Items with Icons */}
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
            >
              <UserIcon />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center" onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
