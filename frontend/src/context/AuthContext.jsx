import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "@/api/auth";
import { AuthSteps, AuthLocalStorage } from "@/app/enum";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [step, setStep] = useState(AuthSteps.LOGIN);
  const [sendOtpEmail, setSendOtpEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem(AuthLocalStorage.TOKEN) || null
  );
  const [loading, setLoading] = useState(true);

  // 🔹 On token change → fetch user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe(token);
        console.log("get me => ", res);
        if (res.success) {
          setUser(res.user);
          setStep(AuthSteps.DASHBOARD);
          console.log("user", res.user);
        } else {
          clearAuth();
        }
      } catch (err) {
        console.error(err);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    // check if pending registration exists
    const pendingToken = localStorage.getItem(AuthLocalStorage.DONE_REGISTER);
    if (pendingToken) {
      setStep(AuthSteps.PRICING_PLANES);
      setToken(pendingToken);
      setLoading(false);
      return;
    }

    fetchUser();
  }, [token]);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AuthLocalStorage.TOKEN);
    localStorage.removeItem(AuthLocalStorage.DONE_REGISTER);
    localStorage.removeItem(AuthLocalStorage.PRICING_COMPLETED);
    localStorage.removeItem(AuthLocalStorage.PAYMENT_SUCCESS);
    setStep(AuthSteps.LOGIN);
  };

  const logout = () => clearAuth();

  // 🔹 Central localStorage handler
  const localStorageSet = async ({ key, value }) => {
    if (!key || !value) return;
    localStorage.setItem(key, value);

    switch (key) {
      case AuthLocalStorage.DONE_REGISTER:
        setStep(AuthSteps.PRICING_PLANES);
        setToken(value);
        break;
      case AuthLocalStorage.TOKEN:
        setToken(value);
        break;
      case AuthLocalStorage.PRICING_COMPLETED:
        setStep(AuthSteps.PAYMENT);
        break;
      // case AuthLocalStorage.PAYMENT_SUCCESS:
      //   navigate("/dashboard");
      //   break;
      default:
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        sendOtpEmail,
        setSendOtpEmail,
        selectedPlan,
        setSelectedPlan,
        user,
        setUser,
        token,
        setToken,
        localStorageSet,
        logout,
        loading,
        setLoading,
        AuthSteps,
        AuthLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
