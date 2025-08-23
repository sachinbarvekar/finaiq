import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_ADMIN_USERS, MOCK_SUPER_ADMIN_USER, MOCK_CLIENT_USER } from '../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (email: string, pass: string) => {
    // Mock API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const adminUser = MOCK_ADMIN_USERS.find(admin => admin.email === email);

        if (email === MOCK_SUPER_ADMIN_USER.email && pass === 'superadmin123') {
          sessionStorage.setItem('authUser', JSON.stringify(MOCK_SUPER_ADMIN_USER));
          setUser(MOCK_SUPER_ADMIN_USER);
          resolve();
        } else if (adminUser && pass === 'admin123') {
          sessionStorage.setItem('authUser', JSON.stringify(adminUser));
          setUser(adminUser);
          resolve();
        } else if (email === MOCK_CLIENT_USER.email && pass === 'client123') {
          sessionStorage.setItem('authUser', JSON.stringify(MOCK_CLIENT_USER));
          setUser(MOCK_CLIENT_USER);
          resolve();
        }
        else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    sessionStorage.removeItem('authUser');
    setUser(null);
    navigate('/login');
  };

  const value = { isAuthenticated: !!user, user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
