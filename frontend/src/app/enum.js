// Enum for steps
export const AuthSteps = Object.freeze({
  LOGIN: "login",
  REGISTER: "register",
  VERIFY_OTP: "verifyOtp",
  PRICING_PLANES: "pricingPlanes",
  FORGOT_PASSWORD: "forgot-password",
  PAYMENT: "payment",
});

export const AuthLocalStorage = Object.freeze({
  TOKEN: "token",
  USER_REGISTER: "user",
  PRICING_COMPLETED: "pricingCompleted",
  PAYMENT_SUCCESS: "paymentSuccess",
});
