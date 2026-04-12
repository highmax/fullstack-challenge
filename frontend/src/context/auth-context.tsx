'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth.service';
import { LoginCredentials } from '@/types';

interface AuthContextType {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount, check if there's a token in cookies
  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedEmail = Cookies.get('email');
    if (savedToken) {
      setToken(savedToken);
      setEmail(savedEmail || null);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    Cookies.set('token', data.token, { expires: 1 }); // 1 day
    Cookies.set('email', data.email, { expires: 1 });
    setToken(data.token);
    setEmail(data.email);
    router.push('/');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    setToken(null);
    setEmail(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
