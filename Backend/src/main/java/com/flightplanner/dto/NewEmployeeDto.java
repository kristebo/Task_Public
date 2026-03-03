package com.flightplanner.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new employee.
 */
@Schema(description = "Data required to create a new employee")
public record NewEmployeeDto(
        @Schema(description = "Employee's first name", example = "John")
        @NotBlank(message = "First name is required")
        @Size(max = 100)
        String firstName,

        @Schema(description = "Employee's last name", example = "Doe")
        @NotBlank(message = "Last name is required")
        @Size(max = 100)
        String lastName,

        @Schema(description = "Employee's email address", example = "john.doe@example.com")
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "Employee's department", example = "Engineering")
        @NotBlank(message = "Department is required")
        @Size(max = 100)
        String department,

        @Schema(description = "Employee's job title", example = "Software Engineer")
        @NotBlank(message = "Title is required")
        @Size(max = 100)
        String title,

        @Schema(description = "Whether the employee is active", example = "true")
        Boolean active
) {}
