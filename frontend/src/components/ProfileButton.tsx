import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { User } from "lucide-react";


export const ProfileButton = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogin = () => {
        setOpen(false);
    };

    const handleProfile = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        window.location.reload();

        setOpen(false);
    };

    return (
        <div className="relative inline-block text-left text-sm" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2"
            >
                {token ? (
                    <img
                        src={user?.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                        alt="User Avatar"
                        className="inline h-10 w-10 mr-2 bg-gray-200 rounded-full"
                    />
                ) : (
                    <User className="inline h-10 w-10 mr-2 bg-gray-200 hover:bg-gray-300 rounded-full" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-md z-50">
                    {token ? (<>
                        <div className="flex p-4 border-b border-gray-200">
                            {user ? <>
                                <img
                                    src={user.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                                    alt="User Avatar"
                                    className="inline h-12 w-12 bg-gray-200 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <div className="px-4">
                                        {user.displayName || user.username}
                                    </div>
                                    <div className="px-4">
                                        @{user.username}
                                    </div>
                                    <Link
                                        to={`/@${user.username}`}
                                        className="block px-4 py-2 text-left text-sm text-blue-600 hover:text-blue-700"
                                        onClick={handleProfile}
                                    >
                                        View your profile
                                    </Link>
                                </div>
                            </> : <></>}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="block w-full p-4 text-left hover:bg-gray-100"
                        >
                            Log out
                        </button>
                    </>
                    ) : <>
                        <div className="flex flex-col text-center p-4 border-b border-gray-200">
                            <div className="text-md mb-2">
                                Get started by logging in or signing up.
                            </div>
                            <Link to="/login" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleLogin}>
                                Log in
                            </Link>
                        </div>

                    </>}


                </div>
            )}
        </div>
    );
};
