import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const useAuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { token, login, register, error, logout } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password || (isRegistering && !username)) return;

    setLoading(true);
    try {
      const success = isRegistering
        ? await register(email, password, username)
        : await login(email, password);

      if (success) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistering,
    setIsRegistering,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    handleSubmit,
    logout,
    loading,
    token,
    error,
  };
};
