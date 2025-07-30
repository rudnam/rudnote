import { useState, useCallback } from "react";
import type { Note } from "../types";
import { useNotes } from "./useNotes";

export function useEditor() {
  const {
    createNote,
    updateNote,
    deleteNote,
    notes,
    fetchNotes,
    isFetching,
    hasError,
  } = useNotes();

  const [form, setForm] = useState({ title: "", content: "" });
  const [lastSavedForm, setLastSavedForm] = useState({
    title: "",
    content: "",
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isEditing = !!activeNote;
  const showForm = isEditing || isCreating;
  const hasUnsavedChanges =
    form.title !== lastSavedForm.title ||
    form.content !== lastSavedForm.content;

  const resetForm = () => {
    setForm({ title: "", content: "" });
    setLastSavedForm({ title: "", content: "" });
    setActiveNote(null);
    setIsCreating(false);
  };

  const createNew = () => {
    resetForm();
    setIsCreating(true);
    scrollToTop();
  };

  const editNote = (note: Note) => {
    setActiveNote(note);
    setForm({ title: note.title, content: note.content });
    setLastSavedForm({ title: note.title, content: note.content });
    setIsCreating(false);
    scrollToTop();
  };

  const autoSave = useCallback(async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setIsSaving(true);
    try {
      if (activeNote) {
        await updateNote(activeNote.id, form);
      } else {
        const newNote = await createNote(form);
        setActiveNote(newNote);
        setIsCreating(false);
      }
      setLastSavedForm({ ...form });
    } catch (err) {
      console.error("AutoSave error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [form, activeNote, updateNote, createNote]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteNote(deleteId);
    if (activeNote?.id === deleteId) resetForm();
    setDeleteId(null);
  };

  return {
    notes,
    form,
    setForm,
    activeNote,
    isEditing,
    isCreating,
    isSaving,
    hasError,
    isFetching,
    fetchNotes,
    autoSave,
    createNew,
    editNote,
    resetForm,
    showForm,
    hasUnsavedChanges,
    deleteId,
    setDeleteId,
    confirmDelete,
  };
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
