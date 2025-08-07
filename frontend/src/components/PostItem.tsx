import { Link } from "react-router";
import type { Post } from "../types";
import { formatExactTime, getRelativeTime } from "../lib/utils";

export const PostItem = ({ post }: { post: Post }) => {
    const publishedAtDate = new Date(post.publishedAt);

    return (
        <Link
            to={`/@${post.author.username}/${post.slug}`}
            className="flex flex-col h-full p-3 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors space-y-2"
        >
            <div>
                <p className="text-xs text-gray-600 mb-1">
                    <img
                        src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                        alt="User Avatar"
                        className="inline h-6 w-6 rounded-full mr-1"
                    />
                    {post.author.displayName}
                </p>
                <h3 className="text-lg font-semibold font-serif">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.summary}</p>
            </div>
            <p
                className="text-xs text-gray-500 mt-auto"
                title={formatExactTime(publishedAtDate)}
            >
                {getRelativeTime(publishedAtDate)}
            </p>
        </Link>
    );
};
