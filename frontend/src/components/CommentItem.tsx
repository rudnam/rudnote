import { Link } from "react-router";
import type { Comment, UserPublic } from "../types";
import { CommentMenu } from "./CommentMenu";
import { formatExactTime, getRelativeTime } from "../lib/utils";

export const CommentItem = ({
    comment,
    user,
    isEditing,
    editingContent,
    setEditingCommentId,
    setEditingContent,
    handleCommentDelete,
    handleCommentEdit,
}: {
    comment: Comment;
    user: UserPublic | null;
    isEditing: boolean;
    editingContent: string;
    setEditingCommentId: (id: string | null) => void;
    setEditingContent: (content: string) => void;
    handleCommentDelete: (id: string) => void;
    handleCommentEdit: (id: string, content: string) => void;
}) => {
    const isAuthor = user?.username === comment.author?.username;
    const createdAtDate = new Date(comment.createdAt);

    return (
        <div className="flex items-start  text-[0.8rem] space-x-4 border border-zinc-300 rounded-lg p-4">
            <Link to={`/@${comment.author?.username}`} className="mr-3">
                <img
                    src={comment.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                    className="w-10 h-10 rounded-full object-cover"
                />
            </Link>
            <div className="flex-1 text-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <Link to={`/@${comment.author.username}`} className="text-[0.9rem] font-semibold hover:underline">
                            {comment.author.displayName || comment.author.username}
                        </Link>
                        <span
                            className="text-[0.8rem] text-zinc-500"
                            title={formatExactTime(createdAtDate)}
                        >
                            ・{getRelativeTime(createdAtDate)}
                        </span>
                    </div>

                    {isAuthor && !isEditing && (
                        <CommentMenu
                            isEditing={false}
                            onEdit={() => {
                                setEditingCommentId(comment.id);
                                setEditingContent(comment.content);
                            }}
                            onDelete={() => handleCommentDelete(comment.id)}
                        />
                    )}

                </div>

                {isEditing ? (
                    <>
                        <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full mt-2 p-2 border border-zinc-300 rounded"
                            rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => {
                                    handleCommentEdit(comment.id, editingContent);
                                    setEditingCommentId(null);
                                }}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingContent("");
                                }}
                                className="px-3 py-1 text-sm bg-zinc-300 text-black rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-zinc-800 text-sm">{comment.content}</p>
                )}

            </div>
        </div>
    );
};
