import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePostForm } from "../hooks/usePostForm";
import { useUserPosts } from "../hooks/useUserPosts";
import { useAuth } from "../context/AuthContext";

export const StudioEditor = () => {
    const { id } = useParams(); // "new" or postId
    const isNew = id === "new";

    const navigate = useNavigate();
    const { token } = useAuth();
    const { posts, fetchPosts } = useUserPosts(token);
    const {
        createPost,
        updatePost,
        deletePost,
        loading,
        error,
        success,
    } = usePostForm(token);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

    useEffect(() => {
        if (!isNew) {
            const post = posts.find((p: any) => p.id === id);
            if (post) {
                setTitle(post.title);
                setSlug(post.slug);
                setSummary(post.summary ?? "");
                setContent(post.content);
                setStatus(post.status);
            }
        }
    }, [id, posts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !slug || !content) {
            alert("Title, slug, and content are required");
            return;
        }

        if (isNew) {
            await createPost({ title, slug, summary, content, status });
        } else {
            await updatePost(id!, { title, slug, summary, content, status });
        }

        fetchPosts();
        navigate("/studio");
    };

    const handleDelete = async () => {
        if (!id || isNew) return;
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await deletePost(id);
            fetchPosts();
            navigate("/studio");
        } catch (err) {
            alert("Failed to delete post");
            console.error(err);
        }
    };

    const generateSlug = () => {
        const newSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setSlug(newSlug);
    };

    return (
        <div className="flex-1 max-w-2xl mx-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold text-center">
                {isNew ? "New Post" : "Edit Post"}
            </h2>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
                <p className="text-green-600 text-sm">Operation successful!</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-3 py-2 border rounded text-sm w-full"
                />

                <div className="flex gap-2">
                    <input
                        placeholder="URL slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded text-sm"
                    />
                    <button
                        type="button"
                        onClick={generateSlug}
                        className="px-3 py-2 border text-sm rounded bg-gray-100 hover:bg-gray-200"
                    >
                        Generate
                    </button>
                </div>

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

                <div className="flex flex-wrap gap-3 items-center">
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
                        {loading ? "Saving..." : isNew ? "Create Post" : "Update Post"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/studio")}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>

                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
