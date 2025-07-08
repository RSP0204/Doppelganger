'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  loading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUserId = localStorage.getItem('userId');
      if (storedAuth === 'true' && storedUserId) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
      }
      setLoading(false);
    }
  }, []);

  const login = (id: string) => {
    setIsAuthenticated(true);
    setUserId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', id);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userId');
      // Clear all user-specific data from localStorage on logout
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('uploadedTranscript_') || key.startsWith('uploadedFileName_') || key.startsWith('generatedDialogues_'))) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, userId }}>
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
