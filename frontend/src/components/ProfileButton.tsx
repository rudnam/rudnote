import { Link, useNavigate } from "react-router";
import { User } from "lucide-react";
import { PopoutMenu } from "./PopoutMenu";
import { useAuth } from "../context/AuthContext";

export const ProfileButton = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const trigger = token ? (
        <img
            src={user?.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
            alt="User Avatar"
            className="h-8 w-8 rounded-full bg-zinc-200 mr-2"
        />
    ) : (
        <User className="h-8 w-8 bg-zinc-200 hover:bg-zinc-300 rounded-full mr-2" />
    );

    return (
        <PopoutMenu trigger={trigger} align="right">
            {token ? (
                <>
                    <div className="flex p-4 gap-4 border-b border-zinc-200 items-center">
                        <img
                            src={user?.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                            alt="User Avatar"
                            className="h-12 w-12 bg-zinc-200 rounded-full"
                        />
                        <div className="text-left">
                            <div className="font-semibold">{user?.displayName || user?.username}</div>
                            <div className="text-zinc-500">@{user?.username}</div>
                        </div>
                    </div>

                    <Link
                        to={`/@${user?.username}`}
                        className="block w-full px-4 py-2 text-left hover:bg-zinc-100"
                    >
                        View your profile
                    </Link>

                    <Link
                        to="/studio"
                        className="block w-full px-4 py-2 text-left hover:bg-zinc-100"
                    >
                        Visit Studio
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-zinc-100"
                    >
                        Log out
                    </button>
                </>
            ) : (
                <div className="flex flex-col text-center p-4 border-b border-zinc-200">
                    <div className="text-md mb-2">Get started by logging inp.</div>
                    <Link
                        to="/login"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Log in
                    </Link>
                </div>
            )}
        </PopoutMenu>
    );
};
