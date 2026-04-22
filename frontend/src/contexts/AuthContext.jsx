import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' or 'user'
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and role on initial load
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser({ username: storedUser });
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, newRole, newUser) => {
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
    setIsAuthenticated(true);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    if (typeof newUser === 'string') {
      localStorage.setItem('user', newUser);
    } else {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
