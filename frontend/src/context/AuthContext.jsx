import { createContext, useEffect, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'cdc_token';
const STORAGE_USER_KEY = 'cdc_user';
const STORAGE_ROLE_KEY = 'cdc_role';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    const storedRole = localStorage.getItem(STORAGE_ROLE_KEY);

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken, newUser, newRole) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_ROLE_KEY, newRole);
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_ROLE_KEY);
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  // The Axios interceptor in services/api.js dispatches this on any 401.
  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('cdc:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('cdc:unauthorized', handleUnauthorized);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, role, token, loading, isAuthenticated: !!token, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
