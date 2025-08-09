import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePostForm } from "../hooks/usePostForm";
import { useUserPosts } from "../hooks/useUserPosts";
import { useAuth } from "../context/AuthContext";
import { MilkdownEditor } from "../components/MilkdownEditor";
import { AutoResizeTextarea } from "../components/AutoResizeTextArea";
import { readingTime } from "../lib/utils";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const StudioEditor = () => {
    const { id } = useParams();
    const isNew = id === "new";

    const navigate = useNavigate();
    const { token, user } = useAuth();
    const { posts, fetchPosts } = useUserPosts(token);
    const {
        createPost,
        updatePost,
        deletePost,
        loading: postLoading,
        error,
        success,
    } = usePostForm(token);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
    const [editorLoading, setEditorLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isNew) {
            setEditorLoading(true);
            const post = posts.find((p) => p.id === id);
            if (post) {
                setTitle(post.title);
                setSlug(post.slug);
                setSummary(post.summary ?? "");
                setContent(post.content);
                setStatus(post.status);
            }
            setEditorLoading(false);
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
        navigate(status === 'PUBLISHED' ? `/@${user?.username}/${slug}` : "/studio");
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

    if (editorLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Loading editor..." />
            </div>
        );
    }


    return (
        <article className="flex-1 max-w-2xl w-full mx-auto p-4">
            <AutoResizeTextarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="prose-h text-4xl border border-zinc-300 rounded-md p-2"
            />
            <AutoResizeTextarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short summary"
                className="text-lg text-zinc-500 border border-zinc-300 rounded-md p-2"
            />

            <div className="text-sm text-zinc-500 flex flex-wrap items-center not-prose mb-8 border-b border-zinc-200 pb-4 gap-2">
                <div className="flex items-center">
                    <div className="flex items-center space-x-2 h-16">
                        <img
                            src={user?.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="font-semibold text-zinc-800">{user?.displayName ?? "You"}</div>
                    </div>
                    ・{readingTime(content)}
                    ・<select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                        className="py-2 rounded text-sm border border-zinc-300 bg-white"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>
                <div className="md:ml-auto flex gap-4">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={postLoading}
                    >
                        {postLoading ? "Saving..." : isNew ? "Create Post" : "Update Post"}
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(status === 'PUBLISHED' ? `/@${user?.username}/${slug}` : "/studio")
                        }
                        className="not-btn text-zinc-500 hover:underline"
                    >
                        Cancel
                    </button>
                </div>


            </div>


            <section>
                <div className="border border-zinc-300 rounded-md p-2 focus:ring-2 overflow-hidden">
                    <MilkdownEditor
                        value={content}
                        onChange={setContent}
                        postId={id ?? "new"}
                    />
                </div>
            </section>

            <section className="space-y-4 mt-10">
                <h2 className="text-lg font-semibold text-zinc-700">Post Settings</h2>
                <div className="flex gap-2 items-center flex-wrap text-sm">
                    <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="URL slug"
                        className="px-3 py-2 border rounded w-full sm:w-auto text-sm"
                    />
                    <button
                        type="button"
                        onClick={generateSlug}
                    >
                        Generate Slug
                    </button>
                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="not-btn ml-auto text-sm text-red-600 hover:underline hover:bg-red-50 px-3 py-2 rounded"
                        >
                            Delete Post
                        </button>
                    )}
                </div>


            </section>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Saved successfully!</p>}
        </article>
    );
};
