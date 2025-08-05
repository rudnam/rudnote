import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePostForm } from "../hooks/usePostForm";
import { useUserPosts } from "../hooks/useUserPosts";

export const Studio = () => {
    const { token } = useAuth();
    const { fetchPosts, posts, loading: postsLoading } = useUserPosts(token);
    const { createPost, updatePost, deletePost, loading, error, success } = usePostForm(token);

    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setSummary("");
        setContent("");
        setStatus("DRAFT");
        setEditingPostId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !slug.trim() || !content.trim()) {
            return alert("All fields are required");
        }

        if (editingPostId) {
            await updatePost(editingPostId, { title, slug, summary, content, status });
        } else {
            await createPost({ title, slug, summary, content, status });
        }

        fetchPosts();

        if (success) {
            resetForm();
        };
    };

    const handleEditClick = (post: any) => {
        setEditingPostId(post.id);
        setTitle(post.title);
        setSlug(post.slug);
        setSummary(post.summary ?? "");
        setContent(post.content);
        setStatus(post.status);
    };

    const handleDeleteClick = async (postId: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(postId);
                alert("Post deleted successfully");
                fetchPosts();
            } catch (err) {
                console.error("Error deleting post:", err);
                alert("Failed to delete post");
            }
        }
    };

    return (
        <div className="flex-1 max-w-2xl mx-auto p-6 flex flex-col space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Your Posts</h2>
                {postsLoading ? (
                    <p>Loading...</p>
                ) : (
                    posts.length === 0 ? (
                        <p className="text-center text-sm text-slate-500">No posts yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {posts.map((post: any) => (
                                <li key={post.id} className="flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2">
                                    <div>
                                        <h3 className="text-lg font-semibold font-serif">{post.title}</h3>
                                        <p className="text-sm text-gray-600">{post.summary}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <button
                                            onClick={() => handleEditClick(post)}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(post.id)}
                                            className="ml-4 text-sm text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                )}

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold text-center">
                    {editingPostId ? "Edit Post" : "New Post"}
                </h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">Operation successful!</p>}

                <input
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-3 py-2 border rounded text-sm w-full"
                />
                <input
                    placeholder="URL slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="px-3 py-2 border rounded text-sm w-full"
                />
                <input
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="px-3 py-2 border rounded text-sm w-full"
                />
                <textarea
                    placeholder="Write your content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="px-3 py-2 border rounded text-sm w-full h-32 resize-none"
                />
                <div className="flex gap-3 items-center">
                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as "DRAFT" | "PUBLISHED")
                        }
                        className="px-3 py-2 border rounded text-sm"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : editingPostId
                                ? "Update Post"
                                : "Create Post"}
                    </button>
                    {editingPostId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
