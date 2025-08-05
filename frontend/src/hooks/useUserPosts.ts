import { useEffect, useState } from "react";
import { getUserPosts } from "../services/postService";

export function useUserPosts(token: string | null) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        if (!token) {
            setError("No authentication token provided");
            setLoading(false);
            return;
        }
        try {
            const result = await getUserPosts(token);
            setPosts(result);
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
