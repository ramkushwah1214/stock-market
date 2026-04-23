import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { authApi, type AuthUser } from '../api/auth';


type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: { fullname: string; email: string; password: string; investorType: 'beginner' | 'existing' }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        return;
      }
      throw error;
    }
  };

  useEffect(() => {
    refreshUser()
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(payload) {
      const response = await authApi.login(payload);
      setUser(response.user);
      return response.user;
    },
    async register(payload) {
      const response = await authApi.register(payload);
      setUser(response.user);
      return response.user;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
    },
    async refreshUser() {
      await refreshUser();
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
