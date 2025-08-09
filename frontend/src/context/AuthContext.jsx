import React, { useState, useEffect, createContext } from "react";
import getCurrentUser from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move fetchUser outside useEffect so you can call it anywhere inside AuthProvider
  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser(); // uses cookie session
      if (!userData) {
        // Don't clear user immediately, just log and keep old user?
        console.warn("No user data returned but not clearing user state yet.");
        return;
      }
      setUser(userData);
    } catch (error) {
      setUser(null); // user not logged in or session expired
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // ✅ initial fetch
  }, []);

  const login = async (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };


  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
