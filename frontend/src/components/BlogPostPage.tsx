import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { API_URL } from "../consts";
import ReactMarkdown from "react-markdown";
import { readingTime } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import type { Comment, Post } from "../types";

export const BlogPostPage = () => {
    const { userSlug, slug } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const username = userSlug?.startsWith('@') ? userSlug.slice(1) : userSlug;

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const { token } = useAuth();


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/@${username}/${slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch post");
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError("Error fetching post");
            } finally {
                setLoading(false);
            }
        };

        if (username && slug) {
            fetchPost();
        }
    }, [username, slug]);

    useEffect(() => {
        if (post) {
            const fetchComments = async () => {
                try {
                    const response = await fetch(`${API_URL}/posts/@${username}/${post.id}/comments`);
                    if (!response.ok) throw new Error("Failed to fetch comments");
                    const data = await response.json();
                    console.log(data);
                    setComments(data);
                } catch (err) {
                    console.error(err);
                    setComments([]);
                }
            };
            fetchComments();
        }
    }, [post, username]);

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        if (!post) {
            setError("Post not found");
            return;
        }

        setCommentLoading(true);
        try {
            const response = await fetch(`${API_URL}/posts/@${username}/${post?.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: commentText }),
            });

            if (!response.ok) throw new Error("Failed to post comment");

            const newComment = await response.json();
            setComments((prev) => [...prev, newComment]);
            setCommentText("");
        } catch (err) {
            console.error(err);
            setError("Failed to post comment");
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <article className="max-w-2xl w-full mx-auto p-6">
            {post ? <><h1 className="text-4xl font-bold">{post.title}</h1>
                <div className="text-sm text-gray-500 flex items-center not-prose">
                    <Link to={`/@${username}`} className="flex items-center space-x-2 h-16">
                        <img src={"https://avatars.githubusercontent.com/u/70255485?v=4"} alt="User Avatar" className="h-12 w-12 rounded-full" />
                        <div className="font-semibold text-gray-800">
                            {post.author.username}
                        </div>
                    </Link>

                    ・{readingTime(post.content)}・{new Date(post.publishedAt!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>
                <div className="prose">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                <section className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>

                    {token ? (
                        <div className="mb-6">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-2"
                                rows={3}
                                placeholder="Leave a comment..."
                            />
                            <button
                                onClick={handleCommentSubmit}
                                disabled={commentLoading}
                                className="px-4 py-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {commentLoading ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-600 mb-4">Sign in to leave a comment.</p>
                    )}

                    <div className="space-y-6 not-prose">
                        {comments.map((c) => (
                            <div key={c.id} className="flex items-start text-md space-x-4 border pb-4 border-gray-300 rounded-lg p-4">
                                <Link to={`/@${c.author.username}`} className="mr-4">
                                    <img src={c.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"} className="w-12 h-12 rounded-full" />
                                </Link>
                                <div>
                                    <div>
                                        <Link to={`/@${c.author.username}`} className="text-[0.9rem] font-semibold">
                                            @{c.author.displayName || c.author.username}
                                        </Link>
                                        <span className="text-[0.8rem] text-gray-500 mb-1">{"・"}{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <p className="text-gray-800">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section></>
                :
                <div className="text-center text-gray-500">Post not found</div>}


        </article>
    );
};
