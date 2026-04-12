import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import api from '../lib/axios';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'VC' | 'HOD' | 'TEACHER';
  department: string | null;
  photo?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    console.info('[Auth] Hydration started');
    const storedToken = localStorage.getItem('profcv_token');
    const storedUser = localStorage.getItem('profcv_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.info('[Auth] Hydration success');
      } catch {
        console.error('[Auth] Hydration failed: invalid stored auth state');
        localStorage.removeItem('profcv_token');
        localStorage.removeItem('profcv_user');
      }
    } else {
      console.info('[Auth] No stored auth state found');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.info('[Auth] Login attempt', { email });
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });

    console.info('[Auth] Login success', { userId: data.user.id, role: data.user.role });
    localStorage.setItem('profcv_token', data.token);
    localStorage.setItem('profcv_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    console.info('[Auth] Logout');
    localStorage.removeItem('profcv_token');
    localStorage.removeItem('profcv_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('profcv_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
