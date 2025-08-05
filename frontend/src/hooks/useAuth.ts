import { useState, useEffect } from "react";
import { API_URL } from "../consts";
import type { User } from "../types";

export const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (token && !user) {
            getCurrentUser();
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

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Login failed");
            }

            const { token } = await res.json();
            localStorage.setItem("token", token);
            setToken(token);

            const fetchedUser = await getCurrentUser();
            if (!fetchedUser) throw new Error("Failed to fetch user");

            return true;
        } catch (err: any) {
            setError(err.message || "Something went wrong");
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

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Registration failed");
            }

            return true;
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            return false;
        }
    };

    const getCurrentUser = async (): Promise<User | null> => {
        if (!token) return null;
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            return data;
        } catch (err) {
            console.error("getCurrentUser error", err);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
    };

    return { token, login, register, logout, error, user };
};
