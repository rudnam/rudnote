import { Link } from "react-router";
import type { Post } from "../types";

export const PostItem = ({ post }: { post: Post }) => {
    return (
        <Link
            to={`/@${post.author.username}/${post.slug}`}
            className="block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
            <p className="text-xs text-gray-600">
                <img src={post.author.avatarUrl || "https://avatars.githubusercontent.com/u/70255485?v=4"} alt="User Avatar" className="inline h-6 w-6 rounded-full mr-2" />
                {post.author.username}
            </p>
            <h3 className="text-lg font-semibold font-serif">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.summary}</p>
            <p className="text-xs text-gray-500">{new Date(post.publishedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })}</p>
        </Link>
    );
}