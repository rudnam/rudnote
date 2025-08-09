import { useEffect, useState } from "react";
import { getPublishedPostsByUsername } from "../services/postService";
import type { Post } from "../types";

interface PageInfo {
    number: number;
    totalPages: number;
    size: number;
    totalElements: number;
    first: boolean;
    last: boolean;
}

export function usePublishedPosts(username: string, initialPage = 0, pageSize = 6) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        number: 0,
        totalPages: 0,
        size: pageSize,
        totalElements: 0,
        first: true,
        last: false,
    });

    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getPublishedPostsByUsername(username, page, pageSize)
            .then((pagedResponse) => {
                setPosts(pagedResponse.content);
                setPageInfo({
                    number: pagedResponse.number,
                    totalPages: pagedResponse.totalPages,
                    size: pagedResponse.size,
                    totalElements: pagedResponse.totalElements,
                    first: pagedResponse.first,
                    last: pagedResponse.last,
                });
            })
            .catch((err) => setError(err.message || "Failed to load posts."))
            .finally(() => setLoading(false));
    }, [username, page, pageSize]);

    return { posts, loading, error, pageInfo, setPage };
}
