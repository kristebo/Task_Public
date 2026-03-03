package com.flightplanner.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration for the Flight Planner API.
 * This configuration mirrors the original TypeScript swagger.ts specification.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI flightPlannerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Flight Planner API")
                        .version("1.0.0")
                        .description("Internal flight planning backend for candidate exercise."))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:3001")
                                .description("Local dev (Spring Boot)")
                ))
                .tags(List.of(
                        new Tag().name("Health"),
                        new Tag().name("Employees").description("Manage employees"),
                        new Tag().name("Itineraries").description("Manage travel itineraries and flight segments"),
                        new Tag().name("Groups").description("Manage travel groups")
                ))
                .components(new Components()
                        .addSecuritySchemes("ApiKeyAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("x-api-key")))
                .addSecurityItem(new SecurityRequirement().addList("ApiKeyAuth"));
    }
}
