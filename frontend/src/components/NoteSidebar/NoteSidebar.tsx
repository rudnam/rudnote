import { Download, Plus, X } from "lucide-react";
import clsx from "clsx";
import type { Note } from "../../types";
import { useSidebarContent } from "../../hooks/useSidebarContent";
import NoteList from "./NoteList";

type Props = {
  notes: Note[];
  editingNoteId: string | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onDownload: (note: Note) => void;
  onDownloadAll: () => void;
  open: boolean;
  onClose: () => void;
  onCreateNew: () => void;
};

export default function NoteSidebar({
  notes,
  editingNoteId,
  onEdit,
  onDelete,
  onDownload,
  onDownloadAll,
  open,
  onClose,
  onCreateNew,
}: Props) {
  const { shouldRenderContent, handleSelect } = useSidebarContent(
    open,
    onClose,
    onEdit
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/30 md:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          "z-40 md:z-0 bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-300 dark:border-zinc-700 h-full",
          "fixed top-0 left-0 w-72 transition-transform duration-300",
          open
            ? "translate-x-0 md:relative md:w-72"
            : "-translate-x-full md:relative"
        )}
      >
        <div
          className={clsx(
            "flex flex-col h-full p-4 space-y-2 overflow-y-auto",
            !shouldRenderContent && "opacity-0 pointer-events-none md:invisible"
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Notes</span>
            <button
              onClick={onClose}
              className="md:hidden text-zinc-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="pt-2">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>

          {/* Notes List */}
          <NoteList
            notes={notes}
            editingNoteId={editingNoteId}
            onSelect={handleSelect}
            onDelete={onDelete}
            onDownload={onDownload}
          />

          {/* Download All */}
          {notes.length > 0 && (
            <div className="pt-4 mt-auto border-t border-zinc-300 dark:border-zinc-700">
              <button
                onClick={onDownloadAll}
                className="mx-auto w-3/4 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
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
