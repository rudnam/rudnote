import clsx from "clsx";
import type { Note } from "../../types";
import NoteActionsDropdown from "./NoteActionsDropdown";

type Props = {
  notes: Note[];
  editingNoteId: string | null;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
  onDownload: (note: Note) => void;
};

export default function NoteList({
  notes,
  editingNoteId,
  onSelect,
  onDelete,
  onDownload,
}: Props) {
  if (notes.length === 0) {
    <p className="text-center text-zinc-500 dark:text-zinc-400 pt-10">
      No notes yet.
    </p>;
  }

  return (
    <div className="space-y-1 ">
      {notes.map((note) => {
        const isActive = editingNoteId === note.id;
        return (
          <div
            key={note.id}
            className={clsx(
              "group flex items-center px-2 py-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800",
              isActive && "bg-zinc-200 dark:bg-zinc-800"
            )}
          >
            <button
              onClick={() => onSelect(note)}
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
    </div>
  );
}
