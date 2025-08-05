import { useState } from "react";
import type { PostData } from "../types";
import { API_URL } from "../consts";

export const usePostForm = (token: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createPost = async (data: PostData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            setSuccess(true);
        } catch (err) {
            setError("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id: string, data: PostData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await fetch(`${API_URL}/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            setSuccess(true);
        } catch (err) {
            setError("Failed to update post");
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess(true);
        } catch (err) {
            setError("Failed to delete post");
        } finally {
            setLoading(false);
        }
    };

    return { createPost, updatePost, deletePost, loading, error, success };
};
