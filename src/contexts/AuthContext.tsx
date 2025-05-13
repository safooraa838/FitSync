import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('fitsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('fitsync_user', JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };
  
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          resolve(false);
        } else {
          const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
          };
          
          setUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem('fitsync_user', JSON.stringify(newUser));
          resolve(true);
        }
      }, 800);
    });
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fitsync_user');
  };
  
  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('fitsync_user', JSON.stringify(updatedUser));
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};