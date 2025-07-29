import { useState } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import ConfirmDialog from "./components/ConfirmDialog";
import NoteSidebar from "./components/NoteSidebar";
import { useTheme } from "./hooks/useTheme";
import { useNotes } from "./hooks/useNotes";
import type { Note } from "./types";

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    isFetching,
    hasError,
  } = useNotes();

  const [form, setForm] = useState({ title: "", content: "" });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isEditing = Boolean(activeNote);
  const showForm = isEditing || isCreating;

  const resetForm = () => {
    setForm({ title: "", content: "" });
    setActiveNote(null);
    setIsCreating(false);
  };

  const createNew = () => {
    resetForm();
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editNote = (note: Note) => {
    setActiveNote(note);
    setIsCreating(false);
    setForm({ title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveNote = async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    setIsSaving(true);
    try {
      if (activeNote) {
        await updateNote(activeNote.id, form);
      } else {
        const newNote = await createNote(form);
        setActiveNote(newNote);
        setIsCreating(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteNote(deleteId);
    if (activeNote?.id === deleteId) resetForm();
    setDeleteId(null);
  };

  const downloadNote = (note: Note) => {
    const content = `# ${note.title}\n\n${note.content}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllNotes = () => {
    const content = notes
      .map((note) => `# ${note.title}\n\n${note.content}\n\n---\n`)
      .join("\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_notes_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      {hasError && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-4 flex items-center justify-between text-sm text-red-600 bg-red-100 border border-red-300 rounded p-3 dark:bg-red-900 dark:text-red-200 dark:border-red-600">
            <span>Cannot connect to backend. Please check your server.</span>
            <button
              onClick={fetchNotes}
              disabled={isFetching}
              className="ml-4 text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isFetching ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-4 gap-4 flex-col md:flex-row">
        <NoteSidebar
          notes={notes}
          editingNoteId={activeNote?.id || null}
          onEdit={editNote}
          onDelete={setDeleteId}
          onDownload={downloadNote}
          onDownloadAll={downloadAllNotes}
        />

        <main className="flex-1 min-h-0 overflow-y-auto">
          {!showForm ? (
            <div className="flex items-center justify-center md:h-full py-40">
              <div className="text-center text-zinc-500 dark:text-zinc-400 space-y-4">
                <div className="text-lg font-medium">No note selected</div>
                <button
                  onClick={createNew}
                  className="text-sm px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  + New Note
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-screen-sm mx-auto w-full space-y-6">
              <NoteForm
                {...form}
                setTitle={(title) => setForm((f) => ({ ...f, title }))}
                setContent={(content) => setForm((f) => ({ ...f, content }))}
                onSubmit={saveNote}
                isSaving={isSaving}
                isEditing={isEditing}
                isCreating={isCreating}
                cancelEdit={resetForm}
                noteId={activeNote?.id ?? null}
              />
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete note?"
        description="This will permanently delete the note. Are you sure?"
      />
    </div>
  );
}

export default App;
