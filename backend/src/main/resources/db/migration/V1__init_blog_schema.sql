-- Create users table
CREATE TABLE users (
   id UUID PRIMARY KEY,
   username VARCHAR(100) NOT NULL UNIQUE,
   email VARCHAR(255) NOT NULL UNIQUE,
   password_hash TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
   id UUID PRIMARY KEY,
   title TEXT NOT NULL,
   slug TEXT NOT NULL UNIQUE,
   content TEXT,
   status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED')),
   author_id UUID REFERENCES users(id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   published_at TIMESTAMP
);
