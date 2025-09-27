import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

const Icon = ({ name, className, ...props }) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in lucide-react`);
    return null;
  }
  return <LucideIcon className={cn("icon", className)} {...props} />;
};

export default Icon;
