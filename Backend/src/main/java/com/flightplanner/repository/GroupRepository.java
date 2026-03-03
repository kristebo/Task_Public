package com.flightplanner.repository;

import com.flightplanner.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for Group entity.
 * TODO: Add custom query methods as needed.
 */
@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {

    @Query("SELECT g FROM Group g LEFT JOIN FETCH g.members LEFT JOIN FETCH g.itineraries WHERE g.id = :id")
    Group findByIdWithMembersAndItineraries(@Param("id") UUID id);
}
