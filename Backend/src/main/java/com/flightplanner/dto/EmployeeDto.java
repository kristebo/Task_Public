package com.flightplanner.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;

/**
 * DTO for employee response.
 */
@Schema(description = "Employee record. Avatar is available via GET /api/employees/{id}/avatar endpoint.")
public record EmployeeDto(
        @Schema(description = "Unique identifier")
        String id,

        @Schema(description = "Employee's first name", example = "John")
        String firstName,

        @Schema(description = "Employee's last name", example = "Doe")
        String lastName,

        @Schema(description = "Employee's email address", example = "john.doe@example.com")
        String email,

        @Schema(description = "Employee's department", example = "Engineering")
        String department,

        @Schema(description = "Employee's job title", example = "Software Engineer")
        String title,

        @Schema(description = "Whether the employee is active")
        boolean active,

        @Schema(description = "Creation timestamp")
        OffsetDateTime createdAt,

        @Schema(description = "Last update timestamp")
        OffsetDateTime updatedAt
) {}
