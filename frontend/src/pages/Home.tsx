import { usePosts } from "../hooks/usePosts";
import { PostItem } from "../components/PostItem";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home() {
    const { posts, loading, error } = usePosts();

    return (
        <div className="w-full max-w-screen-md mx-auto py-6 md:px-6 space-y-10">
            <section className="space-y-4">
                <h1 className="text-center font-semibold text-lg">Latest Posts</h1>

                {loading && <LoadingSpinner text="Loading posts..." />}

                {!loading && error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-center text-sm">No posts yet.</p>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="max-w-xl mx-auto flex flex-col">
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
