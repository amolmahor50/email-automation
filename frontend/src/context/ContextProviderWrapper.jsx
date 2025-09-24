import { AuthProvider } from "./AuthContext";

const providers = [AuthProvider];

export const ContextProviderWrapper = ({ children }) => {
  return providers.reduceRight((kids, Provider) => {
    return <Provider>{kids}</Provider>;
  }, children);
};
