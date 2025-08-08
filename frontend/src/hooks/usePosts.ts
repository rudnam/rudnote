import { useEffect, useState } from "react";
import { fetchAllPosts } from "../services/postService";
import type { Post } from "../types";
import { sortPostsByDateDesc } from "../lib/utils";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPosts()
      .then((fetchedPosts) => {
        setPosts(sortPostsByDateDesc([...fetchedPosts]));
      })
      .catch((err) => setError(err.message || "Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading, error };
}
