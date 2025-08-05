import { useState } from "react";
import { API_URL } from "../consts";


export const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");

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

            const token = await res.text();
            localStorage.setItem("token", token);
            setToken(token);
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

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    return { token, login, register, logout, error };
};
