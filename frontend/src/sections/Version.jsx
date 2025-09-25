import { APP_VERSION } from "@/app/path";

export default function Version() {
  return <p className="text-sm text-foreground">Version : {APP_VERSION}</p>;
}
