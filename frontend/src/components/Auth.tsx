import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const Auth = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const { token, login, register, error, logout } = useAuth();

    const handleSubmit = async () => {
        const success = isRegistering
            ? await register(email, password, username)
            : await login(email, password);

        if (success) {
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center bg-gray-50 py-10">
            {!token ? (
                <section className="space-y-4 w-full max-w-md">
                    <h2 className="text-lg font-semibold text-center">
                        {isRegistering ? "Register" : "Log In"}
                    </h2>

                    <div className="flex justify-center items-center gap-2">
                        <span className="text-sm">Login</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isRegistering}
                                onChange={() => setIsRegistering(!isRegistering)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[4px] after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                        <span className="text-sm">Register</span>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 border rounded text-sm w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-3 py-2 border rounded text-sm w-full"
                    />

                    {isRegistering && (
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-3 py-2 border rounded text-sm w-full"
                        />
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 bg-blue-600 text-white rounded text-sm"
                    >
                        {isRegistering ? "Register" : "Log In"}
                    </button>
                </section>
            ) : (
                <section className="space-y-4 text-center">
                    <p className="text-green-600">Logged in!</p>
                    <button
                        onClick={logout}
                        className="mt-4 py-2 px-4 bg-red-500 text-white rounded text-sm"
                    >
                        Log Out
                    </button>
                </section>
            )}
        </div>
    );
};
