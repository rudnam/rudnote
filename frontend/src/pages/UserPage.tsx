import { useParams } from "react-router";
import { useUserByUsername } from "../hooks/useUserByUsername";
import { usePublishedPosts } from "../hooks/usePublishedPosts";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { UserProfileForm } from "../components/UserProfileForm";
import { UserHeader } from "../components/UserHeader";
import { UserPosts } from "../components/UserPosts";
import type { UserPublic } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const UserPage = () => {
    const { userSlug } = useParams();
    const { user: authUser, token } = useAuth();

    const isSelf = userSlug === `@${authUser?.username}`;
    const username = isSelf ? authUser?.username : userSlug?.startsWith("@") ? userSlug.slice(1) : userSlug;

    if (!username) {
        return <div className="p-6 text-red-500">Invalid username</div>;
    }

    const {
        user: fetchedUser,
        loading: userLoading,
        error: userError
    } = useUserByUsername(username);

    const { posts, loading: postsLoading, error: postsError } = usePublishedPosts(username);

    const [editing, setEditing] = useState(false);

    if (!isSelf && userLoading) {
        return <LoadingSpinner text="Loading user profile..." />;
    }

    if (!isSelf && (userError || !fetchedUser)) {
        return <div className="p-6 text-red-500">Error: {userError || "User not found"}</div>;
    }

    const displayUser: UserPublic = isSelf ? (authUser as UserPublic) : (fetchedUser as UserPublic);

    return (
        <div className="flex-1 max-w-screen-sm w-full mx-auto p-6">
            <UserHeader user={displayUser} isOwner={isSelf} onEdit={() => setEditing(true)} />

            {isSelf && editing && authUser && (
                <UserProfileForm
                    user={authUser}
                    token={token}
                    onClose={() => setEditing(false)}
                />
            )}

            <section>
                <p className="text-zinc-700 mb-4">{displayUser.bio || "No bio"}</p>
            </section>

            <UserPosts posts={posts} loading={postsLoading} error={postsError} />
        </div>
    );
};
