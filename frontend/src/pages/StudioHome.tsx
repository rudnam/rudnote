import { Link, useNavigate } from "react-router";
import { useUserPosts } from "../hooks/useUserPosts";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const StudioHome = () => {
    const { token } = useAuth();
    const { posts, loading, error } = useUserPosts(token);
    const navigate = useNavigate();

    return (
        <div className="flex-1 max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Posts</h2>
                <button
                    onClick={() => navigate("/studio/new")}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                >
                    + New Post
                </button>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading posts..." />
            ) : error ? (
                <p className="text-red-600 text-sm">{error}</p>
            ) : posts.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center">No posts yet.</p>
            ) : (
                <ul className="space-y-2">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            to={`/studio/${post.id}`}
                            className="flex flex-col h-full p-4 border border-zinc-300 rounded-lg hover:bg-zinc-200 transition-colors space-y-2"
                        >
                            <div>
                                <h3 className="text-lg font-semibold font-serif">{post.title}</h3>
                                <p className="text-sm text-zinc-600">{post.summary}</p>
                            </div>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
};
