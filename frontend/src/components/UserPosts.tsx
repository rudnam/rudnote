import { PostItem } from "./PostItem";
import type { Post } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";

export const UserPosts = ({
    posts,
    loading,
    error
}: {
    posts: Post[];
    loading: boolean;
    error: string | null;
}) => {
    if (loading) return <LoadingSpinner text="Loading posts..." />;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <section>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Posts</h2>
            <ul className="-mx-4">
                {posts.length > 0 ? (
                    posts.map((post) => <PostItem key={post.id} post={post} />)
                ) : (
                    <li className="text-zinc-600">No posts available</li>
                )}
            </ul>
        </section>
    );
};
