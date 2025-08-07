import { useEffect, useState } from "react";
import { API_URL } from "../consts";
import type { Post } from "../types";

export const usePost = (username?: string, slug?: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/@${username}/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError("Error fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [username, slug]);

  return { post, loading, error };
};
