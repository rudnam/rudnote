import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuthForm } from "../hooks/useAuthForm";

export const Auth = () => {
    const {
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
    } = useAuthForm();

    return (
        <div className="flex-1 flex flex-col items-center bg-zinc-50 py-10 px-6">
            {!token ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4 w-full max-w-md"
                >
                    <h2 className="text-lg font-semibold text-center">
                        {isRegistering ? "Register" : "Log In"}
                    </h2>

                    {/* Toggle Login/Register */}
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-sm">Login</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isRegistering}
                                onChange={() => setIsRegistering(!isRegistering)}
                            />
                            <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[4px] after:top-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:tranzinc-x-full" />
                        </label>
                        <span className="text-sm">Register</span>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}

                    {isRegistering && (
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-3 py-2 border rounded text-sm w-full"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 border rounded text-sm w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-3 py-2 border rounded text-sm w-full"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading
                            ? <LoadingSpinner text="Processing..." />
                            : isRegistering
                                ? "Register"
                                : "Log In"}
                    </button>
                </form>
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
