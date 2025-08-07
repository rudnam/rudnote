import type { UserPublic } from "../types";
import { CommentItem } from "./CommentItem";
import type { Comment } from "../types";

export const CommentList = ({
    comments,
    user,
    editingCommentId,
    editingContent,
    setEditingCommentId,
    setEditingContent,
    handleCommentDelete,
    handleCommentEdit,
}: {
    comments: Comment[];
    user: UserPublic | null;
    editingCommentId: string | null;
    editingContent: string;
    setEditingCommentId: (id: string | null) => void;
    setEditingContent: (content: string) => void;
    handleCommentDelete: (id: string) => void;
    handleCommentEdit: (id: string, content: string) => void;
}) => (
    <div className="space-y-6 not-prose">
        {comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    user={user}
                    isEditing={editingCommentId === comment.id}
                    editingContent={editingContent}
                    setEditingCommentId={setEditingCommentId}
                    setEditingContent={setEditingContent}
                    handleCommentDelete={handleCommentDelete}
                    handleCommentEdit={handleCommentEdit}
                />
            ))}
    </div>
);
