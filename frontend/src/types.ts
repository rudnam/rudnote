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
    summary: string;
    status: "DRAFT" | "PUBLISHED";
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    author: User;
};

export type PostData = {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  location: string;
  createdAt: string;
  deactivated: boolean;
}

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  post: Post;
}
