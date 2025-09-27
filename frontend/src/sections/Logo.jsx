import { TypographyH3, TypographyH6 } from "@/components/custom/Typography";
import { APP_LOGO } from "@/app/path";

export function Logo() {
  return (
    <div className="md:w-12 w-10 flex items-center gap-2">
      <img src={APP_LOGO} alt="logo" />
      <div className="flex flex-col font-bold text-[#006296]">
        <TypographyH6>Email</TypographyH6>
        <TypographyH3>Automation</TypographyH3>
      </div>
    </div>
  );
}

export function SmallLogo() {
  return (
    <div className="w-8 flex items-center gap-2">
      <img src={APP_LOGO} alt="logo" />
      <div className="flex flex-col font-bold text-[#006296]">
        <TypographyH6>Email</TypographyH6>
        <TypographyH3>Automation</TypographyH3>
      </div>
    </div>
  );
}
