import { useEffect, useState } from "react";
import { API_URL } from "../consts";
import type { Comment, Post } from "../types";

export const useComments = ({
  post,
  token,
  username,
}: {
  post: Post | null;
  token: string | null;
  username?: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!post || !username) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/@${username}/${post.id}/comments`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setComments(data);
      } catch {
        setComments([]);
      }
    };

    fetchComments();
  }, [post, username]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !post || !token) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts/@${username}/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (!res.ok) throw new Error();
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch {
      // optionally handle error
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // optionally handle error
    }
  };

  const handleCommentEdit = async (id: string, newContent: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch {
      // optionally handle error
    }
  };

  return {
    comments,
    commentText,
    editingCommentId,
    editingContent,
    commentLoading,
    setCommentText,
    setEditingCommentId,
    setEditingContent,
    handleCommentSubmit,
    handleCommentDelete,
    handleCommentEdit,
  };
};
