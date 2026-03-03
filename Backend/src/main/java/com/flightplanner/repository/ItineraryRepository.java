package com.flightplanner.repository;

import com.flightplanner.entity.Itinerary;
import com.flightplanner.entity.ItineraryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Itinerary entity.
 * TODO: Add custom query methods as needed.
 */
@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {

    List<Itinerary> findByEmployeeId(UUID employeeId);

    List<Itinerary> findByStatus(ItineraryStatus status);

    List<Itinerary> findByEmployeeIdAndStatus(UUID employeeId, ItineraryStatus status);

    @Query("SELECT i FROM Itinerary i LEFT JOIN FETCH i.segments WHERE i.id = :id")
    Itinerary findByIdWithSegments(@Param("id") UUID id);
}
