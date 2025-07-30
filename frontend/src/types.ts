export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
};

export type NotePayload = Omit<Note, "id" | "createdAt" | "updatedAt">;

export type NoteForm = {
  title: string;
  content: string;
};
