import { Link } from "react-router";
import type { UserPublic } from "../types";

export const UserHeader = ({
    user,
    isOwner,
    onEdit
}: {
    user: UserPublic;
    isOwner: boolean;
    onEdit: () => void;
}) => (
    <div className="flex space-x-4 items-center mb-6">
        <img
            src={user.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
            alt="User Avatar"
            className="h-24 w-24 rounded-full"
        />
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-sans">{user.displayName || user.username}</h1>
            <p className="text-gray-600">@{user.username}</p>
            {isOwner && (
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="text-[0.8rem] mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                        Edit Profile
                    </button>
                    <Link to={`/studio`} className="text-[0.8rem] mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" >
                        Manage Posts
                    </Link>
                </div>

            )}
        </div>
    </div>
);
