import { useEffect, useState } from "react";
import { getMyPosts } from "../services/postService";
import type { Post } from "../types";

export function useUserPosts(token: string | null) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        if (!token) {
            setError("No authentication token provided");
            setLoading(false);
            return;
        }
        try {
            const result = await getMyPosts(token);
            setPosts(result.content);
        } catch (err: any) {
            setError(err.message || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [token]);

    return { fetchPosts, posts, loading, error };
}
