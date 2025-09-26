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
  TOKEN: "congnitoIdentity",
  DONE_REGISTER: "congnitoIndentityRegister",
  PRICING_COMPLETED: "pricingCompleted",
  PAYMENT_SUCCESS: "paymentSuccess",
});
