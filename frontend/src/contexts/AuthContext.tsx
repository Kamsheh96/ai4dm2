import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check localStorage for existing session
  useEffect(() => {
    const savedUsername = localStorage.getItem('ai4dm_username');
    const savedAuth = localStorage.getItem('ai4dm_authenticated');

    if (savedUsername && savedAuth === 'true') {
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newUsername: string) => {
    setUsername(newUsername);
    setIsAuthenticated(true);
    localStorage.setItem('ai4dm_username', newUsername);
    localStorage.setItem('ai4dm_authenticated', 'true');
  };

  const logout = () => {
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ai4dm_username');
    localStorage.removeItem('ai4dm_authenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
