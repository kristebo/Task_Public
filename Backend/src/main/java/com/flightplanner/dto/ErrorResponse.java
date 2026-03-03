package com.flightplanner.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Standard error response format matching frontend expectations.
 */
@Schema(description = "Standard error response")
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        @Schema(description = "Error details", requiredMode = Schema.RequiredMode.REQUIRED) ErrorDetails error) {

    @Schema(description = "Error details object")
    public record ErrorDetails(
            @Schema(description = "Error code", example = "VALIDATION")
            String code,
                    @Schema(description = "Error message", example = "Validation failed")
            String message,
                    @Schema(description = "Additional error details")
            List<Object> details
    ) {
        public ErrorDetails(String code, String message) {
            this(code, message, null);
        }
    }

    public static ErrorResponse of(String code, String message) {
        return new ErrorResponse(new ErrorDetails(code, message));
    }

    public static ErrorResponse of(String code, String message, List<Object> details) {
        return new ErrorResponse(new ErrorDetails(code, message, details));
    }

    public static ErrorResponse notFound(String message) {
        return of("NOT_FOUND", message);
    }

    public static ErrorResponse validation(String message, List<Object> details) {
        return of("VALIDATION", message, details);
    }

    public static ErrorResponse validation(String message) {
        return of("VALIDATION", message);
    }
}
