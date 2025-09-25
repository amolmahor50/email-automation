import { Button } from "@/components/ui/button";
// @mui
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// @project
import GetImagePath from "@/utils/GetImagePath";

// @assets
import googleIcon from "@/assets/images/social/google.svg";
import facebookIcon from "@/assets/images/social/facebook.svg";
import appleIcon from "@/assets/images/social/apple-light.svg";

/***************************  SOCIAL BUTTON - DATA  ***************************/

const authButtons = [
  {
    label: "Google",
    icon: googleIcon,
    title: "Sign in with Google",
  },
  {
    label: "Facebook",
    icon: facebookIcon,
    title: "Sign in with Facebook",
  },
  {
    label: "Apple",
    icon: appleIcon,
    title: "Sign in with Apple",
  },
];

/***************************  AUTH - SOCIAL  ***************************/

export default function AuthSocial() {
  return (
    <div>
      <section className="grid grid-cols-3 gap-4">
        {authButtons.map((item, index) => (
          <Button
            key={index}
            className="rounded-md shadow-none"
            variant="outline"
          >
            <img
              src={GetImagePath(item.icon)}
              alt={item?.title}
              className="h-5"
            />
          </Button>
        ))}
      </section>

      <Divider sx={{ my: { xs: 4, sm: 5 } }}>
        <Typography variant="body2" color="text.secondary">
          or continue with email
        </Typography>
      </Divider>
    </div>
  );
}
