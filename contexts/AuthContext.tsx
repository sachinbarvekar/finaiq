
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

// Mock Users
export const MOCK_ADMIN_USER: User = {
  id: 'A001',
  name: 'Sagar Agrobeet',
  email: 'admin@finaiq.com',
  role: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  phone: '123-456-7890',
  team: 'Platform Operations',
  memberSince: '2022-08-22',
};

export const MOCK_CLIENT_USER: User = {
  id: 'U001',
  name: 'John Doe',
  email: 'client@innovate.com',
  role: 'Client',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  phone: '555-111-2222',
  team: 'Innovate Inc.',
  memberSince: '2023-01-15',
  clientId: 'C001',
  folderId: 'F001'
};


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
        if (email === MOCK_ADMIN_USER.email && pass === 'admin123') {
          sessionStorage.setItem('authUser', JSON.stringify(MOCK_ADMIN_USER));
          setUser(MOCK_ADMIN_USER);
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
