import { useState } from "react";
import type { Note } from "../types";
import { Menu, Download } from "lucide-react";
import clsx from "clsx";
import NoteActionsDropdown from "./NoteActionsDropdown";

type Props = {
  notes: Note[];
  editingNoteId: string | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onDownload: (note: Note) => void;
  onDownloadAll: () => void;
};

export default function NoteSidebar({
  notes,
  editingNoteId,
  onEdit,
  onDelete,
  onDownload,
  onDownloadAll,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (note: Note) => {
    onEdit(note);
    setMobileOpen(false); // close on mobile
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden mb-2 flex items-center text-zinc-500 hover:text-black dark:hover:text-white"
      >
        <Menu className="w-5 h-5 mr-1" />
        Notes
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "z-20 md:z-auto md:static md:w-72 md:border-r border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 h-full overflow-y-auto transition-transform",
          mobileOpen
            ? "fixed top-0 left-0 bottom-0 w-72 shadow-lg"
            : "hidden md:block"
        )}
      >
        <div className="h-full flex flex-col p-4 space-y-1">
          {notes.length === 0 && (
            <p className="text-center text-zinc-400 pt-10">No notes yet.</p>
          )}

          {notes.map((note) => {
            const isActive = editingNoteId === note.id;
            return (
              <div
                key={note.id}
                className={clsx(
                  "group flex items-center px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isActive && "bg-zinc-200 dark:bg-zinc-700"
                )}
              >
                <button
                  onClick={() => handleSelect(note)}
                  className={clsx(
                    "truncate text-sm text-left flex-1",
                    isActive
                      ? "font-medium text-zinc-900 dark:text-white"
                      : "text-zinc-700 dark:text-zinc-100"
                  )}
                >
                  {note.title || "(Untitled)"}
                </button>

                <NoteActionsDropdown
                  onDownload={() => onDownload(note)}
                  onDelete={() => onDelete(note.id)}
                />
              </div>
            );
          })}

          {/* Download All Button */}
          {notes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-700">
              <button
                onClick={onDownloadAll}
                className="mx-auto w-3/4 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All Notes
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
