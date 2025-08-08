import { Link } from "react-router";
import type { Post } from "../types";
import { formatExactTime, getRelativeTime } from "../lib/utils";

export const PostItem = ({ post }: { post: Post }) => {
    const publishedAtDate = new Date(post.publishedAt);

    return (
        <Link
            to={`/@${post.author.username}/${post.slug}`}
            className="flex flex-col gap-2 p-4 border-zinc-300 hover:bg-zinc-100 transition-colors [&:not(:last-child)]:border-b h-[180px]"
        >
            <div className="flex items-center gap-1 text-xs text-zinc-600">
                <img
                    src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"}
                    alt="User Avatar"
                    className="h-6 w-6 rounded-full"
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
                <img
                    src={"https://images.unsplash.com/photo-1554629947-334ff61d85dc"}
                    alt="Blog image"
                    className="max-h-24 max-w-32 w-full rounded-lg object-cover"
                />
            </div>

        </Link>
    );
};
