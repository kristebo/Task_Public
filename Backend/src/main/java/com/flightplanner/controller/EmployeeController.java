package com.flightplanner.controller;

import com.flightplanner.dto.EmployeeDto;
import com.flightplanner.dto.ErrorResponse;
import com.flightplanner.dto.NewEmployeeDto;
import com.flightplanner.dto.UpdateEmployeeDto;
import com.flightplanner.entity.Employee;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.annotation.Description;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Employee operations.
 *
 * Endpoints:
 * - GET /api/employees - List all employees
 * - GET /api/employees/{id} - Get employee by ID
 * - POST /api/employees - Create new employee
 * - PATCH /api/employees/{id} - Update employee
 * - DELETE /api/employees/{id} - Delete employee
 * - GET /api/employees/{id}/avatar - Get employee avatar
 * - POST /api/employees/{id}/avatar - Upload employee avatar
 */
@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees", description = "Manage employees")
public class EmployeeController {

    @GetMapping
    @Operation(summary = "List employees", description = "Returns a list of all employees")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = EmployeeDto.class)))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en funksjon som henter ut og lister alle ansatte.")
    public ResponseEntity<List<EmployeeDto>> listEmployees() {
        // TODO: Implement
      return null;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee", description = "Returns a single employee by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class))),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en funksjon som henter én ansatt.")
    public ResponseEntity<EmployeeDto> getEmployee(
            @Parameter(description = "Employee ID", required = true) @PathVariable String id) {
        // TODO: Implement
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Create employee", description = "Creates a new employee")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en funksjon som oppretter en ansatt.")
    public ResponseEntity<EmployeeDto> createEmployee(
            @Valid @RequestBody NewEmployeeDto employee) {
        // TODO: Implement
        return ResponseEntity.status(201).build();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update employee", description = "Updates an existing employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en funksjon som oppdater en ansatt.")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @Parameter(description = "Employee ID", required = true) @PathVariable String id,
            @RequestBody UpdateEmployeeDto employee) {
        // TODO: Implement
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee", description = "Deletes an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted"),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en funksjon som sletter en ansatt.")
    public ResponseEntity<Void> deleteEmployee(
            @Parameter(description = "Employee ID", required = true) @PathVariable String id) {
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{id}/avatar", produces = { MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE,
            "image/webp", "image/svg+xml" })
    @Operation(summary = "Get employee avatar (custom upload or generated identicon)", description = "Returns the employee's avatar image. Either a custom uploaded image or a generated identicon.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Image", content = {
                    @Content(mediaType = "image/svg+xml"),
                    @Content(mediaType = "image/png"),
                    @Content(mediaType = "image/jpeg"),
                    @Content(mediaType = "image/webp")
            }),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en fuksjon som henter profilbilde for ansatte eller generer dersom ansatte ikke har eget bilde.")
    public ResponseEntity<byte[]> getEmployeeAvatar(
            @Parameter(description = "Employee ID", required = true) @PathVariable String id) {
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload custom avatar for employee", description = "Uploads a custom avatar image for an employee. Accepts PNG, JPEG, or WebP (max 2MB).")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Uploaded", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AvatarUploadResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @Description("Implementer en fuksjon som laster opp bilde for en ansatt.")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @Parameter(description = "Employee ID", required = true) @PathVariable String id,
            @Parameter(description = "Avatar image file", required = true) @RequestParam("file") MultipartFile file) {
        // TODO: Implement avatar upload
        return ResponseEntity.status(201).body(Map.of(
                "message", "Avatar uploaded successfully",
                "path", "/api/employees/" + id + "/avatar"));
    }

    @Schema(description = "Avatar upload response")
    record AvatarUploadResponse(
            @Schema(description = "Success message") String message,
            @Schema(description = "Path to the avatar") String path) {
    }

    private EmployeeDto toDto(Employee employee) {
            return new EmployeeDto(
                            employee.getId().toString(),
                            employee.getFirstName(),
                            employee.getLastName(),
                            employee.getEmail(),
                            employee.getDepartment(),
                            employee.getTitle(),
                            employee.isActive(),
                            employee.getCreatedAt(),
                            employee.getUpdatedAt());
    }
}
