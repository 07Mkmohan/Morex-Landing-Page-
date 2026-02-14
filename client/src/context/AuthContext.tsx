import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../api/client";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    mobile: string,
    companyName: string,
    companyAddress: string,
  ) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const handleAuth = (tokenValue: string, nextUser: User) => {
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    setUser(nextUser);
    setAuthToken(tokenValue);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    handleAuth(data.token, data.user);
    return data.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    mobile: string,
    companyName: string,
    companyAddress: string,
  ) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      mobile,
      companyName,
      companyAddress,
    });
    handleAuth(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
