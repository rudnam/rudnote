import Header from "./components/Header/Header";
import NoteForm from "./components/NoteForm/NoteForm";
import NoteSidebar from "./components/NoteSidebar/NoteSidebar";
import ConfirmDialog from "./components/ConfirmDialog";
import ErrorBanner from "./components/ErrorBanner";
import EmptyState from "./components/EmptyState";

import { useTheme } from "./hooks/useTheme";
import { useEditor } from "./hooks/useEditor";
import { useDownloads } from "./hooks/useDownloads";
import { useSidebar } from "./hooks/useSidebar";
import { useNotes } from "./hooks/useNotes";
import { useNoteFormHandlers } from "./hooks/useNoteFormHandlers";

export default function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { notes, isFetching, fetchNotes } = useNotes();
  const {
    form,
    setForm,
    deleteId,
    setDeleteId,
    confirmDelete,
    activeNote,
    isSaving,
    hasError,
    createNew,
    editNote,
    autoSave,
    showForm,
    hasUnsavedChanges,
  } = useEditor();

  const { downloadNote, downloadAllNotes } = useDownloads();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { updateTitle, updateContent } = useNoteFormHandlers(form, setForm);

  return (
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Header
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        title={showForm ? form.title : ""}
        setTitle={showForm ? updateTitle : undefined}
        isEditingNote={showForm}
        onToggleSidebar={toggleSidebar}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {hasError && <ErrorBanner isFetching={isFetching} onRetry={fetchNotes} />}

      <div className="flex flex-1 overflow-hidden pt-[72px] md:flex-row flex-col">
        <NoteSidebar
          notes={notes}
          editingNoteId={activeNote?.id || null}
          onEdit={editNote}
          onDelete={setDeleteId}
          onDownload={downloadNote}
          onDownloadAll={() => downloadAllNotes(notes)}
          open={sidebarOpen}
          onClose={closeSidebar}
          onCreateNew={createNew}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {!showForm ? (
            <EmptyState onCreate={createNew} />
          ) : (
            <NoteForm
              content={form.content}
              setContent={updateContent}
              onAutoSave={autoSave}
              isSaving={isSaving}
              noteId={activeNote?.id ?? null}
              hasUnsavedChanges={hasUnsavedChanges}
            />
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
