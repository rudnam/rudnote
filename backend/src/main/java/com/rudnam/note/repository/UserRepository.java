package com.rudnam.note.repository;

import com.rudnam.note.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.deactivated = false AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchByUsernameOrDisplayName(@Param("query") String query);

}
