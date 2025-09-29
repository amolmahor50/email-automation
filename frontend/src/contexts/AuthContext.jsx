import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { AuthLocalStorage, AuthSteps } from "@/app/enum";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [step, setStep] = useState(AuthSteps.LOGIN);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Load user from localStorage or API
  useEffect(() => {
    const storedUser = localStorage.getItem(AuthLocalStorage.USER_REGISTER);
    const token = localStorage.getItem(AuthLocalStorage.TOKEN);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    } else if (token) {
      authService
        .getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem(
            AuthLocalStorage.USER_REGISTER,
            JSON.stringify(userData)
          );
        })
        .catch(() => {
          localStorage.removeItem(AuthLocalStorage.TOKEN);
          localStorage.removeItem(AuthLocalStorage.USER_REGISTER);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.login({ email, password });
      setUser(userData);

      localStorage.setItem(
        AuthLocalStorage.USER_REGISTER,
        JSON.stringify(userData)
      );
      localStorage.setItem(AuthLocalStorage.TOKEN, userData.token);

      navigate(userData.role === "admin" ? "/admin" : "/dashboard");

      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.signup({
        name,
        email,
        password,
      });
      setUser(userData);
      localStorage.setItem(
        AuthLocalStorage.USER_REGISTER,
        JSON.stringify(userData)
      );
      localStorage.setItem(AuthLocalStorage.TOKEN, userData.token);

      navigate(userData.role === "admin" ? "/admin" : "/dashboard");

      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn(
        "Logout API call failed, but continuing with local logout:",
        error
      );
    } finally {
      setUser(null);
      localStorage.removeItem(AuthLocalStorage.TOKEN);
      localStorage.removeItem(AuthLocalStorage.USER_REGISTER);
      navigate("/auth");
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...updates },
      };
      setUser(updatedUser);
      localStorage.setItem(
        AuthLocalStorage.USER_REGISTER,
        JSON.stringify(updatedUser)
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        step,
        setStep,
        login,
        logout,
        signup,
        updateProfile,
        isLoading,
        setIsLoading,
      }}
    >
      {/* Block rendering until loading is done */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
