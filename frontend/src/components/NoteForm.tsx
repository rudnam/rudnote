type Props = {
  title: string;
  content: string;
  setTitle: (val: string) => void;
  setContent: (val: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
  isCreating: boolean;
  isEditing: boolean;
  cancelEdit: () => void;
};

export default function NoteForm({
  title,
  content,
  setTitle,
  setContent,
  onSubmit,
  isSaving,
  isCreating,
  isEditing,
  cancelEdit,
}: Props) {
  const disabled = isSaving || !title.trim() || !content.trim();
  const actionLabel = isSaving
    ? isEditing
      ? "Updating..."
      : "Creating..."
    : isEditing
    ? "Update Note"
    : "Create Note";

  return (
    <div className="space-y-4 flex flex-col md:h-full">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700 focus:outline-none"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        className="grow w-full h-96 px-3 py-2 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700 resize-none focus:outline-none"
      />

      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-white disabled:bg-zinc-400 dark:bg-white dark:text-black"
        >
          {actionLabel}
        </button>

        {(isEditing || isCreating) && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
