import { API } from "@/app/customAxios";

// Create checkout session
export const createCheckoutSession = async ({ plan, billingCycle, gateway }) => {
  const res = await API.post("/payments/checkout", { plan, billingCycle, gateway });
  return res.data;
};

// Get payment history
export const getPaymentHistory = async ({ page = 1, limit = 20 }) => {
  const res = await API.get(`/payments/history?page=${page}&limit=${limit}`);
  return res.data;
};

// Cancel subscription
export const cancelSubscription = async () => {
  const res = await API.post("/payments/cancel");
  return res.data;
};

// Update subscription
export const updateSubscription = async ({ plan }) => {
  const res = await API.put("/payments/update", { plan });
  return res.data;
};
