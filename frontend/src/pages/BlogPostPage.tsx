import { useParams, Link } from "react-router";
import ReactMarkdown from "react-markdown";
import { formatExactTime, getRelativeTime, readingTime } from "../lib/utils";
import { usePost } from "../hooks/usePost";
import { useComments } from "../hooks/useComments";
import { CommentList } from "../components/CommentList";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const BlogPostPage = () => {
    const { userSlug, slug } = useParams();
    const username = userSlug?.startsWith("@") ? userSlug.slice(1) : userSlug;
    const { user, token } = useAuth();

    const {
        post,
        loading: postLoading,
        error: postError,
    } = usePost(username, slug);

    const {
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
    } = useComments({ post, token, username });

    if (postLoading) return <LoadingSpinner text="Loading post..." />;
    if (postError) return <div>Error: {postError}</div>;
    if (!post) return <div className="text-center text-gray-500">Post not found</div>;

    const publishedAtDate = new Date(post.publishedAt);

    return (
        <article className="max-w-2xl w-full mx-auto p-6">
            <h1 className="text-4xl font-bold mb-2!">{post.title}</h1>
            <div className="text-lg text-gray-500">{post.summary}</div>
            <div className="text-sm text-gray-500 flex items-center not-prose mb-8 border-b border-gray-200 pb-4">
                <Link to={`/@${username}`} className="flex items-center space-x-2 h-16">
                    <img
                        src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full"
                    />
                    <div className="font-semibold text-gray-800 hover:underline">{post.author.displayName}</div>
                </Link>
                ・{readingTime(post.content)}
                ・{<span
                    className=""
                    title={formatExactTime(publishedAtDate)}
                >
                    {getRelativeTime(publishedAtDate)}
                </span>}
            </div>


            <div className="prose">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <section className="mt-12">
                <h2 className="text-lg font-semibold mb-4">Comments</h2>

                {token ? (
                    <div className="mb-6">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-2 text-sm"
                            rows={3}
                            placeholder="Leave a comment..."
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={commentLoading}
                            className="px-4 py-2 bg-blue-600 text-[0.8rem] text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {commentLoading ? <LoadingSpinner text="Loading..." /> : "Post Comment"}
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-600 mb-4">Sign in to leave a comment.</p>
                )}

                <CommentList
                    comments={comments}
                    user={user}
                    editingCommentId={editingCommentId}
                    editingContent={editingContent}
                    setEditingCommentId={setEditingCommentId}
                    setEditingContent={setEditingContent}
                    handleCommentDelete={handleCommentDelete}
                    handleCommentEdit={handleCommentEdit}
                />
            </section>
        </article>
    );
};
