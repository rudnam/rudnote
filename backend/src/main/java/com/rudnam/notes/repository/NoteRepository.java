package com.rudnam.notes.repository;

import com.rudnam.notes.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NoteRepository extends
        JpaRepository<Note, UUID> {
}
