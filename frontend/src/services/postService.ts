import { API_URL } from "../consts";
import type { Page, Post } from "../types";

type SortOrder = "asc" | "desc";

export async function fetchAllPosts(
    page: number = 0,
    size: number = 10,
    sortField: string = "publishedAt",
    sortOrder: SortOrder = "desc"
): Promise<Page<Post>> {
    const res = await fetch(
        `${API_URL}/posts?page=${page}&size=${size}&sort=${sortField},${sortOrder}`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getPublishedPostsByUsername(
    username: string,
    page: number = 0,
    size: number = 10,
    sortField: string = "publishedAt",
    sortOrder: SortOrder = "desc"
): Promise<Page<Post>> {
    const res = await fetch(
        `${API_URL}/posts/@${username}?page=${page}&size=${size}&sort=${sortField},${sortOrder}`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getMyPosts(
    token: string,
    page: number = 0,
    size: number = 10,
    sortField: string = "createdAt",
    sortOrder: SortOrder = "desc"
): Promise<Page<Post>> {
    const res = await fetch(
        `${API_URL}/posts/me?page=${page}&size=${size}&sort=${sortField},${sortOrder}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) throw new Error("Failed to fetch posts");

    return res.json();
}
