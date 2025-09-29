import { AdminProvider } from "./AdminContext";
import { AppProvider } from "./AppContext";
import { AuthProvider } from "./AuthContext";

const providers = [AuthProvider, AppProvider];

export const ContextProviderWrapper = ({ children }) => {
  return providers.reduceRight((kids, Provider) => {
    return <Provider>{kids}</Provider>;
  }, children);
};
