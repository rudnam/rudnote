import { API_URL } from "../consts";
import type { Post } from "../types";

export async function fetchAllPosts(): Promise<Post[]> {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}


export async function getPublishedPostsByUsername(username: string): Promise<Post[]> {
    const res = await fetch(`${API_URL}/posts/@${username}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}


export async function getMyPosts(token: string) {
    const res = await fetch(`${API_URL}/posts/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return res.json();
}

