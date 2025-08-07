-- Add editedAt field to comments
ALTER TABLE comments
    ADD COLUMN edited_at TIMESTAMP;

