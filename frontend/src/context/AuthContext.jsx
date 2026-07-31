import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe, loginUser, registerUser, logoutUser } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // User is not logged in, ignore error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      if (data.success) {
        if (data.token) {
          localStorage.setItem("boxcross_token", data.token);
        }
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      if (data.success) {
        if (data.token) {
          localStorage.setItem("boxcross_token", data.token);
        }
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("boxcross_token");
      setUser(null);
      return { success: true };
    } catch (error) {
      localStorage.removeItem("boxcross_token");
      setUser(null);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
