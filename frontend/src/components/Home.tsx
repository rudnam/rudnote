import { useState, useEffect } from "react";
import type { Post } from "../types";
import { Link } from "react-router";
import { fetchAllPosts } from "../services/postService";



export default function Home() {

    const [posts, setPosts] = useState<Post[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllPosts()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);



    return (
        <div className="flex-1 max-w-screen-sm mx-auto p-6 space-y-10 text-slate-800 flex flex-col">
            <section className="space-y-4">
                <h2 className="text-base font-medium text-center">
                    Latest Posts
                </h2>
                {loading ? (
                    <p className="text-center text-sm text-slate-500">Loading...</p>
                ) : error ? (
                    <p className="text-center text-sm text-red-500">{error}</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-sm text-slate-500">No posts yet.</p>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/posts/${post.slug}`}
                                className="block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <h3 className="text-lg font-semibold font-serif">{post.title}</h3>
                                <p className="text-sm text-gray-600">{post.content.slice(0, 100)}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}