import { MilkdownEditor } from "./MilkdownEditor";
import { useAutoSave } from "../../hooks/useAutoSave";

type Props = {
  content: string;
  setContent: (val: string) => void;
  onAutoSave: () => void;
  isSaving: boolean;
  noteId: string | null;
  hasUnsavedChanges: boolean;
};

export default function NoteForm({
  content,
  setContent,
  onAutoSave,
  isSaving,
  noteId,
  hasUnsavedChanges,
}: Props) {
  useAutoSave({ content, isSaving, hasUnsavedChanges, onAutoSave });

  return (
    <div className="h-full max-w-screen-sm mx-auto flex-1">
      <MilkdownEditor value={content} onChange={setContent} noteId={noteId} />
    </div>
  );
}
