package com.flightplanner.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Seat class enum for flight segments.
 */
public enum SeatClass {
    ECONOMY("economy"),
    PREMIUM("premium"),
    BUSINESS("business"),
    FIRST("first");

    private final String value;

    SeatClass(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public static SeatClass fromValue(String value) {
        for (SeatClass seatClass : SeatClass.values()) {
            if (seatClass.value.equalsIgnoreCase(value)) {
                return seatClass;
            }
        }
        throw new IllegalArgumentException("Unknown seat class: " + value);
    }
}
