import { useEffect, useState } from "react";
import {
  fetchNotesAPI,
  createNoteAPI,
  updateNoteAPI,
  deleteNoteAPI,
} from "../lib/api";
import type { Note, NotePayload } from "../types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchNotes = async () => {
    setIsFetching(true);
    try {
      const data = await fetchNotesAPI();

      const sorted = data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setNotes(sorted);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const createNote = async (note: NotePayload): Promise<Note> => {
    const newNote = await createNoteAPI(note);
    await fetchNotes();
    return newNote;
  };

  const updateNote = async (id: string, note: NotePayload) => {
    await updateNoteAPI(id, note);
    await fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await deleteNoteAPI(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    isFetching,
    hasError,
  };
}
