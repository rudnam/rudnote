package com.rudnam.note.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rudnam.note.models.Note;

import java.util.UUID;

public interface NoteRepository extends
        JpaRepository<Note, UUID> {
}
