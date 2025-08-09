import { usePosts } from "../hooks/usePosts";
import { PostItem } from "../components/PostItem";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home() {
    const { posts, loading, error, pageInfo, setPage } = usePosts(0, 6);

    return (
        <div className="w-full max-w-screen-xl mx-auto py-6 md:px-6 space-y-10">
            <section className="space-y-4 h-full flex flex-col">
                <h1 className="font-semibold text-center text-lg">Latest Posts</h1>
                {loading && <LoadingSpinner text="Loading posts..." />}

                {!loading && error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-center text-sm">No posts yet.</p>
                )}

                {!loading && !error && posts.length > 0 && (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <PostItem key={post.id} post={post} />
                            ))}
                        </div>

                        <div className="flex justify-center items-center space-x-4 mt-auto text-sm">
                            <button
                                disabled={pageInfo.first || loading}
                                onClick={() => setPage(pageInfo.number - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pageInfo.number + 1} of {pageInfo.totalPages}
                            </span>

                            <button
                                disabled={pageInfo.last || loading}
                                onClick={() => setPage(pageInfo.number + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
