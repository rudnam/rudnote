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

export type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
};

export type PostData = {
    title: string;
    slug: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
};