import { useState, useEffect } from "react";
import type { Post } from "../types";
import { fetchAllPosts } from "../services/postService";
import { PostItem } from "./PostItem";

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
        <div className="flex-1 max-w-screen-md mx-auto p-6 space-y-10 text-slate-800 flex flex-col">
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
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}