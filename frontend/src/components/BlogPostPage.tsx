import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { API_URL } from "../consts";
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import { readingTime } from "../lib/utils";

export const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/${slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch post");
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError("Error fetching post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <article className="max-w-2xl w-full mx-auto p-6">
            <h1 className="text-3xl font-bold font-4xl mb-4">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-2">
                <User className="inline h-10 w-10 mr-2 bg-gray-200 rounded-full" />
                {post.author.username}・{readingTime(post.content)}
                ・{new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </p>
            <div className="prose">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
        </article>
    );
}