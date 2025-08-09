import { usePosts } from "../hooks/usePosts";
import { PostItem } from "../components/PostItem";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home() {
    const { posts, loading, error } = usePosts();

    return (
        <div className="w-full max-w-screen-xl mx-auto py-6 md:px-6 space-y-10">
            <section className="space-y-4">

                {loading && <LoadingSpinner text="Loading posts..." />}

                {!loading && error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-center text-sm">No posts yet.</p>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                )}

            </section>
        </div>
    );
}
