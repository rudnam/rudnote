import { useParams, Link } from "react-router";
import { formatExactTime, getRelativeTime, readingTime } from "../lib/utils";
import { usePost } from "../hooks/usePost";
import { useComments } from "../hooks/useComments";
import { CommentList } from "../components/CommentList";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MilkdownViewer } from "../components/MilkdownViewer";

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
    if (!post) return <div className="text-center text-zinc-500">Post not found</div>;

    const publishedAtDate = new Date(post.publishedAt);
    const isOwner = user?.username === post.author.username;

    return (
        <article className="max-w-2xl w-full mx-auto p-4">
            <h1 className="text-4xl mb-2!">{post.title}</h1>
            <div className="text-lg text-zinc-500">{post.summary}</div>
            <div className="text-sm text-zinc-500 flex flex-wrap items-center not-prose mb-8 border-b border-zinc-200 pb-4">
                <Link to={`/@${username}`} className="flex items-center space-x-2 h-16">
                    <img
                        src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="font-semibold text-zinc-800 hover:underline">{post.author.displayName}</div>
                </Link>
                ・{readingTime(post.content)}
                ・{<span
                    className=""
                    title={formatExactTime(publishedAtDate)}
                >
                    {getRelativeTime(publishedAtDate)}
                </span>}
                {isOwner && (
                    <Link
                        to={`/studio/${post.id}`}
                        className="btn md:ml-auto"
                    >
                        Edit Post
                    </Link>
                )}
            </div>

            <div className="prose">
                <MilkdownViewer value={post.content} />
            </div>

            <section className="mt-12">
                <h2 className="text-lg font-semibold mb-4">Comments</h2>

                {token ? (
                    <div className="mb-6">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full border border-zinc-300 rounded-md p-2 mb-2 text-sm"
                            rows={3}
                            placeholder="Leave a comment..."
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={commentLoading}
                            className="text-sm"
                        >
                            {commentLoading ? <LoadingSpinner text="Loading..." /> : "Post Comment"}
                        </button>
                    </div>
                ) : (
                    <p className="text-zinc-600 mb-4">Sign in to leave a comment.</p>
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
