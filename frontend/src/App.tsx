import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
};

export default function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const fetchMyPostsWithToken = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/posts/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Fetching my posts failed:", errText);
        return;
      }

      const data = await res.json();
      console.log("Fetched my posts:", data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching my posts:", err);
    }
  };

  const fetchMyPosts = async () => {
    await fetchMyPostsWithToken(token);
  };

  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Register failed:", errText);
      } else {
        console.log("Registered user:", email);
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Login failed:", errText);
        return;
      }
      const token = await res.text();
      console.log("Login successful, token:", token);
      setToken(token);
      await fetchMyPostsWithToken(token);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const savePost = async () => {
    const payload = { title, slug, content, status };
    const url = editingPostId
      ? `${API_URL}/posts/${editingPostId}`
      : `${API_URL}/posts`;
    const method = editingPostId ? "PUT" : "POST";
    console.log("Before saving post:", payload);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`${method} post failed:`, errText);
        return;
      }

      const result = await res.json();
      console.log(`${editingPostId ? "Updated" : "Created"} post:`, result);
    } catch (err) {
      console.error(`${method} post error:`, err);
    }

    setTitle("");
    setSlug("");
    setContent("");
    setStatus("DRAFT");
    setEditingPostId(null);
    fetchMyPosts();
  };

  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        console.log("Deleted post:", id);
      } else {
        const errText = await res.text();
        console.error("Delete failed:", errText);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }

    fetchMyPosts();
  };

  const editPost = (post: Post) => {
    console.log("Editing post:", post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setStatus(post.status);
    setEditingPostId(post.id);
  };

  return (
    <div className="min-h-screen text-slate-800">
      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-2xl font-semibold">RudNote</h1>
        </header>

        {/* Auth */}
        <section className="space-y-4">
          <h2 className="text-base font-medium text-center">
            Log In / Register
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border rounded text-sm w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border rounded text-sm w-full"
            />
          </div>
          <input
            placeholder="Username (for registration)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-2 border rounded text-sm w-full"
          />
          <div className="flex gap-3">
            <button
              onClick={register}
              className="flex-1 py-2 bg-slate-800 text-white rounded text-sm"
            >
              Register
            </button>
            <button
              onClick={login}
              className="flex-1 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* Post Editor */}
        {token && (
          <section className="space-y-4">
            <h2 className="text-base font-medium text-center">
              {editingPostId ? "Edit Post" : "Create New Post"}
            </h2>
            <input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded text-sm w-full"
            />
            <input
              placeholder="URL slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="px-3 py-2 border rounded text-sm w-full"
            />
            <textarea
              placeholder="Write your content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="px-3 py-2 border rounded text-sm w-full h-24 resize-none"
            />
            <div className="flex gap-3 items-center">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "DRAFT" | "PUBLISHED")
                }
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <button
                onClick={savePost}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                {editingPostId ? "Update" : "Create"}
              </button>
            </div>
          </section>
        )}

        {/* Posts List */}
        <section className="space-y-4">
          <h2 className="text-base font-medium text-center">
            {token ? "My Posts" : "All Posts"}
          </h2>

          {posts.length === 0 ? (
            <p className="text-center text-sm text-slate-500">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="border rounded p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <div className="text-xs text-slate-500">
                        /{post.slug} • {post.status}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{post.content}</p>
                  {token && (
                    <div className="flex gap-3 text-sm pt-2">
                      <button
                        onClick={() => editPost(post)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
