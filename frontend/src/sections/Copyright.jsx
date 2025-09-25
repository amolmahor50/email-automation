import { COPYRIGHT_YEAR, APP_NAME } from "@/app/path";

export default function Copyright() {
  return (
    <p className="text-sm text-gray-600">
      &copy; {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
    </p>
  );
}
