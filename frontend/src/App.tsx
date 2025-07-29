import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Note = {
  id: string;
  title: string;
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    document.documentElement.classList.toggle("dark", useDark);
    setIsDarkMode(useDark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = isDarkMode ? "light" : "dark";
    html.classList.toggle("dark", newTheme === "dark");
    setIsDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const fetchNotes = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`${API_URL}/notes`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setNotes(data);
      setHasError(false);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const createNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const updateNote = async () => {
    if (!editingNoteId || !title.trim() || !content.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/notes/${editingNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setEditingNoteId(null);
        fetchNotes();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const deleteNote = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white p-4 max-w-3xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">Notes</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Markdown note taking
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleTheme}
            className="cursor-pointer disabled:cursor-auto px-3 py-1 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            Switch to {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </header>

      {hasError && (
        <div className="mb-4 flex items-center justify-between text-sm text-red-600 bg-red-100 border border-red-300 rounded p-3 dark:bg-red-900 dark:text-red-200 dark:border-red-600">
          <span>Cannot connect to backend. Please check your server.</span>
          <button
            onClick={fetchNotes}
            disabled={isFetching}
            className="cursor-pointer disabled:cursor-auto ml-4 text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-64 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 resize-none"
          />
          <button
            onClick={editingNoteId ? updateNote : createNote}
            disabled={isCreating || !title.trim() || !content.trim()}
            className="cursor-pointer disabled:cursor-auto flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white disabled:bg-zinc-400 dark:bg-white dark:text-black"
          >
            {isCreating
              ? editingNoteId
                ? "Updating..."
                : "Creating..."
              : editingNoteId
              ? "Update Note"
              : "Create Note"}
          </button>

          {editingNoteId && (
            <button
              onClick={() => {
                setEditingNoteId(null);
                setTitle("");
                setContent("");
              }}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white underline cursor-pointer disabled:cursor-auto"
            >
              Cancel editing
            </button>
          )}
        </div>

        {/* Live preview */}
        <div className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 bg-white dark:bg-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">
            Live Preview
          </h3>
          <div className="prose dark:prose-invert prose-zinc max-w-none overflow-y-auto max-h-92">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-zinc-400">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`border border-zinc-300 dark:border-zinc-700 rounded-md p-4 transition-all ${
                editingNoteId === note.id
                  ? "ring-2 ring-blue-500 border-blue-300 dark:border-blue-400"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-zinc-500 text-md font-mono truncate">
                  {note.title}
                </h2>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setEditingNoteId(note.id);
                      setTitle(note.title);
                      setContent(note.content);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-zinc-400 hover:text-blue-500 cursor-pointer text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-zinc-400 hover:text-red-500 cursor-pointer ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert prose-zinc max-w-none">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
