import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

const fallbackUser = {
  id: 'demo-admin',
  name: 'Dr. Nova',
  email: 'admin@demo.local',
  role: 'admin',
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const stored = localStorage.getItem('auth_token');
      if (!stored) {
        setReady(true);
        return;
      }

      try {
        const { data } = await client.get('/me');
        setToken(stored);
        setUser(data.data);
      } catch {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    hydrate();
  }, []);

  const auth = useMemo(
    () => ({
      token,
      user,
      ready,
      async login(credentials) {
        const { data } = await client.post('/auth/login', credentials);
        localStorage.setItem('auth_token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        return data;
      },
      async register(payload) {
        const { data } = await client.post('/auth/register', payload);
        localStorage.setItem('auth_token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        return data;
      },
      logout() {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      },
      async updateProfile(payload) {
        const { data } = await client.put('/profile', payload);
        setUser(data.data);
        return data;
      },
      demoLogin(role = 'admin') {
        const demo = { ...fallbackUser, role };
        localStorage.setItem('auth_token', 'demo-token');
        setToken('demo-token');
        setUser(demo);
      },
    }),
    [token, user, ready],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
