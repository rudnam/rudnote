import { useEffect, useState } from "react";
import { getPublishedPostsByUsername } from "../services/postService";
import type { Post } from "../types";

export function usePublishedPosts(username: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await getPublishedPostsByUsername(username);
            setPosts(result);
        } catch (err: any) {
            setError(err.message || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [username]);

    return { fetchPosts, posts, loading, error };
}
