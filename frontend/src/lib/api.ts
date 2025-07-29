import type { Note, NotePayload } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const fetchNotesAPI = async (): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNoteAPI = async (note: NotePayload): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return await res.json();
};

export const updateNoteAPI = async (id: string, note: NotePayload) => {
  return fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
};

export const deleteNoteAPI = async (id: string) => {
  return fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
};
