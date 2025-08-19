/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { logout as logoutService, getCurrentUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setIsAuthChecked(true); // ✅ prevent redirects until check finishes
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logoutService();
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    } finally {
      setUser(null);
      setLoggingOut(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser || null);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthChecked,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
