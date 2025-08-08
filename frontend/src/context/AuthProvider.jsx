import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { getCurrentUser } from "../services/authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getCurrentUser();
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      } catch (error) {
        console.warn("User not authenticated:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend to destroy session cookie
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include", // Required to include cookies
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear client-side storage
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
