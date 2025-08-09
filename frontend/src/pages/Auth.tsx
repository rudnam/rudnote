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

                    <div className="flex items-center justify-center gap-3">
                        <span className="text-sm text-gray-700">Login</span>
                        <label className="relative inline-block w-12 h-7 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={isRegistering}
                                onChange={() => setIsRegistering(!isRegistering)}
                            />
                            <span
                                className="
                                    block w-full h-full rounded-full
                                    bg-gray-300 peer-checked:bg-zinc-800
                                    transition-colors duration-300
                                "
                            />
                            <span
                                className="
                                    absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full
                                    shadow-md peer-checked:translate-x-5
                                    transition-transform duration-300
                                "
                            />
                        </label>
                        <span className="text-sm text-gray-700">Register</span>
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
                        className="w-full text-sm"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
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
                        className="mt-4 bg-red-500 text-sm"
                    >
                        Log Out
                    </button>
                </section>
            )}
        </div>
    );
};
