package com.flightplanner.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Status enum for travel itineraries.
 */
public enum ItineraryStatus {
    DRAFT("draft"),
    BOOKED("booked"),
    TRAVELING("traveling"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;

    ItineraryStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public static ItineraryStatus fromValue(String value) {
        for (ItineraryStatus status : ItineraryStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + value);
    }
}
