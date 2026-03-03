package com.flightplanner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing employee.
 */
@Schema(description = "Data for updating an existing employee (all fields optional)")
public record UpdateEmployeeDto(
        @Schema(description = "Employee's first name", example = "John")
        @Size(max = 100)
        String firstName,

        @Schema(description = "Employee's last name", example = "Doe")
        @Size(max = 100)
        String lastName,

        @Schema(description = "Employee's email address", example = "john.doe@example.com")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "Employee's department", example = "Engineering")
        @Size(max = 100)
        String department,

        @Schema(description = "Employee's job title", example = "Software Engineer")
        @Size(max = 100)
        String title,

        @Schema(description = "Whether the employee is active", example = "true")
        Boolean active
) {}
