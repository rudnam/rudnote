import { Download, MoreVertical, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Props = {
  onDelete: () => void;
  onDownload: () => void;
};

export default function NoteActionsDropdown({ onDelete, onDownload }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label="More actions"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="text-zinc-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg z-10">
          <button
            onClick={() => onDownload()}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-red-50 dark:hover:bg-zinc-700"
            title="Download note"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
