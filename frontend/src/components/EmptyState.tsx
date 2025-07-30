type EmptyStateProps = {
  onCreate: () => void;
};

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center h-full text-center text-zinc-500 dark:text-zinc-400">
      <div className="space-y-4">
        <p className="text-lg font-medium">No note selected</p>
        <button
          onClick={onCreate}
          className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          + New Note
        </button>
      </div>
    </div>
  );
}
