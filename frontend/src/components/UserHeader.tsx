import { Link } from "react-router";
import type { UserPublic } from "../types";
import { MapPin, Link as LinkIcon } from "lucide-react";

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
            className="h-24 w-24 rounded-full object-cover"
        />
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-sans">{user.displayName || user.username}</h1>
            <p className="text-zinc-600">@{user.username}</p>
            {user.location && (
                <div className="flex text-sm items-center mt-2 space-x-1">
                    <MapPin className="h-4 w-4" />
                    <p>{user.location}</p>
                </div>
            )}
            {user.websiteUrl && (
                <div className="flex text-sm items-center mt-2 space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <Link
                        className="hover:underline"
                        to={`${user.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{user.websiteUrl}</Link>
                </div>
            )}

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
