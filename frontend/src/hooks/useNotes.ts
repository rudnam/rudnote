import { useEffect, useState } from "react";
import {
  fetchNotesAPI,
  createNoteAPI,
  updateNoteAPI,
  deleteNoteAPI,
} from "../lib/api";
import type { Note } from "../types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchNotes = async () => {
    setIsFetching(true);
    try {
      const data = await fetchNotesAPI();
      setNotes(data);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
    const newNote = await createNoteAPI(note);
    await fetchNotes();
    return newNote;
  };

  const updateNote = async (id: string, note: Omit<Note, "id">) => {
    await updateNoteAPI(id, note);
    await fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await deleteNoteAPI(id);
    setNotes(notes.filter((n) => n.id !== id));
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
