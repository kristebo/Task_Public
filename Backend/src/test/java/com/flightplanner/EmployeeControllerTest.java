package com.flightplanner;

import com.flightplanner.controller.EmployeeController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

    @Test
    @DisplayName("GET /api/employees should return 200")
    void listEmployees_returnsOk() throws Exception {

    }

    @Test
    @DisplayName("GET /api/employees/{id} should return 404 if not found")
    void getEmployee_notFound() throws Exception {

    }

    @Test
    @DisplayName("POST /api/employees should return 201")
    void createEmployee_returnsCreated() throws Exception {

    }

    @Test
    @DisplayName("PATCH /api/employees/{id} should return 404 if not found")
    void updateEmployee_notFound() throws Exception {

    }

    @Test
    @DisplayName("DELETE /api/employees/{id} should return 204")
    void deleteEmployee_returnsNoContent() throws Exception {

    }
}
