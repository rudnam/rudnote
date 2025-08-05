-- Add user profile fields
ALTER TABLE users
    ADD COLUMN display_name TEXT DEFAULT NULL,
    ADD COLUMN bio TEXT DEFAULT NULL,
    ADD COLUMN avatar_url TEXT DEFAULT NULL,
    ADD COLUMN website_url TEXT DEFAULT NULL,
    ADD COLUMN location TEXT DEFAULT NULL,
    ADD COLUMN deactivated boolean DEFAULT false;

-- Add summary field and make slug unique per user
ALTER TABLE posts
    ADD COLUMN summary TEXT,
    DROP CONSTRAINT posts_slug_key,
    ADD CONSTRAINT posts_author_slug_unique UNIQUE (author_id, slug);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
