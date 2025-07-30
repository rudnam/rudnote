import type { NoteForm } from "../types";

export function useNoteFormHandlers(
  _form: NoteForm,
  setForm: React.Dispatch<React.SetStateAction<NoteForm>>
) {
  const updateTitle = (title: string) => setForm((f) => ({ ...f, title }));

  const updateContent = (content: string) =>
    setForm((f) => ({ ...f, content }));

  return { updateTitle, updateContent };
}
