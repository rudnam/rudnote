import { createContext, useContext, useEffect, useState } from "react";
import type { UserMe } from "../types";
import { API_URL } from "../consts";

type AuthContextType = {
  token: string;
  user: UserMe | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  refetchUser: () => Promise<void>;

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState<UserMe | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (authToken: string): Promise<UserMe | null> => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    } catch (err) {
      console.error("fetchUser error", err);
      return null;
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchUser(token).then((u) => {
        if (u) {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        }
      });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const { token } = await res.json();
      const user = await fetchUser(token);
      if (!user) throw new Error("Failed to fetch user");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);

      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const refetchUser = async () => {
    console.log("Refetching user...");
    if (!token) return;
    setUser(null);

    localStorage.removeItem("user");
    const updatedUser = await fetchUser(token);
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };


  return (
    <AuthContext.Provider value={{ token, user, error, login, register, logout, refetchUser }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
