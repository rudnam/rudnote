export interface PageInfo {
  number: number;
  totalPages: number;
  size: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

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
  author: UserPublic;
};

export type PostPayload = Omit<Post, "id" | "createdAt" | "updatedAt" | "publishedAt" | "author">;

export type UserMe = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  location: string;
  createdAt: string;
  deactivated: boolean;
};

export type UserPublic = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  location: string;
  createdAt: string;
};


export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: UserPublic;
  post: Post;
}
