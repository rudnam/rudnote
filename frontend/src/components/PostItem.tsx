import { Link } from "react-router";
import type { Post } from "../types";
import { formatExactTime, getRelativeTime } from "../lib/utils";

export const PostItem = ({ post }: { post: Post }) => {
    const publishedAtDate = new Date(post.publishedAt);

    return (
        <Link
            to={`/@${post.author.username}/${post.slug}`}
            className="flex flex-col gap-2 p-4 border-zinc-200 hover:bg-zinc-200/40 transition-colors h-[200px] md:border [&:not(:last-child)]:border-b md:rounded-lg"
        >
            <div className="flex items-center gap-1 text-xs text-zinc-600">
                <img
                    src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                    alt="User Avatar"
                    className="h-6 w-6 rounded-full object-cover"
                />
                <div>
                    {post.author.displayName}
                </div>
                <div
                    className="ml-auto text-xs text-zinc-600"
                    title={formatExactTime(publishedAtDate)}
                >
                    {getRelativeTime(publishedAtDate)}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col py-1">
                    <h3 className="font-semibold text-lg/6  line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-zinc-600 line-clamp-3">{post.summary}</p>
                </div>
                {post.imageUrls.length > 0 && (
                    <img
                        src={post.imageUrls[0]}
                        alt="Blog image"
                        className="max-h-16 md:max-h-20 max-w-20 md:max-w-28 w-full rounded-lg object-cover"
                    />)}
            </div>

        </Link>
    );
};
