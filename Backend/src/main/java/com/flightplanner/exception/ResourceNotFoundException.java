package com.flightplanner.exception;

/**
 * Exception thrown when a requested resource is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException employee(String id) {
        return new ResourceNotFoundException("Employee not found: " + id);
    }

    public static ResourceNotFoundException itinerary(String id) {
        return new ResourceNotFoundException("Itinerary not found: " + id);
    }

    public static ResourceNotFoundException group(String id) {
        return new ResourceNotFoundException("Group not found: " + id);
    }
}
