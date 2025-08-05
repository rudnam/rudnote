import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { API_URL } from "../consts";
import { useUserPosts } from "../hooks/useUserPosts";
import { useAuth } from "../hooks/useAuth";
import { PostItem } from "./PostItem";

export const UserPage = () => {
    const { userSlug } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const { posts: userPosts } = useUserPosts(token);

    const username = userSlug?.startsWith('@') ? userSlug.slice(1) : userSlug;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}/users/@${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError("Error fetching user");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 max-w-screen-sm w-full mx-auto p-6">
            <div className="flex space-x-4 items-center mb-6">
                <img
                    src={user.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                    alt="User Avatar"
                    className="inline h-18 w-18 rounded-full"
                />
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Bio</h2>
            <p className="text-gray-700 mb-4">{user.bio ?? "No bio"}</p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Posts</h2>
            <ul className="space-y-4">
                {userPosts && userPosts.length > 0 ? (
                    userPosts.filter((p) => p.status !== "DRAFT").map((post: any) => (
                        <PostItem key={post.id} post={post} />
                    ))
                ) : (
                    <li className="text-gray-600">No posts available</li>
                )}
            </ul>

        </div>
    );
}