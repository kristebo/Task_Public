# Project Roadmap

> Living document describing current state, guiding principles, prioritized backlog, and forward-looking improvements for the Flight Planner (Employees / Itineraries / Groups) platform.

Last Updated: 2026-01-13

---
## 1. Executive Summary
The system provides a Java Spring Boot backend API (Employees, Travel Itineraries, Groups) with PostgreSQL persistence and React + Vite + Tailwind frontend. The frontend uses Vite's built-in proxy to route API requests to the Java backend.

Recent milestones include: stable CRUD flows, JPA entity models, optimistic UI updates, and migration from Node.js/Express to Java Spring Boot.

---
## 2. Architecture Overview
### Backend
- **Stack:** Java 17+, Spring Boot 3.2, Spring Data JPA, PostgreSQL/H2.
- **Persistence:** PostgreSQL via Docker, or H2 for local development/testing.
- **Auth:** API key header: `x-api-key` (dev default: `dev-key`).
- **Rate Limiting:** IP-based limiter exposes standard rate headers.
- **Endpoints (core):** `/api/employees`, `/api/itineraries`, `/api/groups`, plus open `/health`, `/swagger-ui.html`.
- **Documentation:** SpringDoc OpenAPI with Swagger UI.

### Frontend
- **Stack:** React (TS), Vite, Tailwind.
- **API Proxy:** Vite dev server proxies `/api/*` requests to Java backend (port 3001).
- **API Client:** Central `api.ts` builds normalized URLs.
- **Forms:** Generic `useForm` + domain hooks (`useEmployeeForm`, `useItineraryForm`).
- **UX Enhancements:** Optimistic creates, dynamic IATA suggestions, validation surfaced client-side pre-submit.

### Cross-Cutting
- **Validation:** Server-side validation via Spring's Bean Validation.
- **Error Format:** `{ error: { code, message, details? } }`.

---
## 3. Guiding Principles
1. **Schema-First:** Define domain contracts once; reuse in validation + docs.
2. **Deterministic Errors:** Stable error codes; no leaking internal stack traces.
3. **Small Surface:** Avoid premature abstractions; refactor after validation by tests.
4. **Performance Pragmatism:** Optimize obvious hotspots (debounce, caching) before micro-tuning.
5. **Security by Default:** Harden headers, restrict origins, and validate all inputs.
6. **Incremental Replaceability:** Design persistence & transport layers so upgrades are low-friction.

---
## 4. Current State Snapshot
| Dimension | Status | Notes |
|----------|--------|-------|
| Backend | Java Spring Boot | Migrated from Node.js/Express |
| Routing | Functional | All routes under `/api/*` |
| Validation | Good baseline | JPA validation + controller-level checks |
| Error Handling | Standardized | Consistent error envelope format |
| Performance | Acceptable | Vite proxy handles frontend-to-backend routing |
| Security | Basic | API key auth, CORS configured |
| Testing | Growing | JUnit tests for backend |
| Observability | Minimal logging | Spring Boot actuator available |
| Persistence | PostgreSQL/H2 | JPA entities with proper relationships |
| Docs | Complete | README + Swagger UI |

---
## 5. Milestones (Now / Next / Later)
### Now (High Impact + Low/Moderate Effort)
1. Complete CRUD implementations for all entities.
2. Add comprehensive JUnit tests for all controllers.
3. Implement avatar upload/identicon generation in Java.
4. Add IATA code search endpoint.

### Next
1. Accessible Combobox replacing datalist (keyboard & screen reader support).
2. Logging: structured logger + request ID middleware.
3. ETag + conditional GET for relatively static resources.
4. Enhanced error taxonomy (e.g., `EMPLOYEE_EMAIL_INVALID`, `SEGMENT_OVERLAP`).

### Later
1. Authentication upgrade (JWT / OIDC) & RBAC.
2. Audit log (immutable append-only events).
3. OpenTelemetry tracing.
4. Dashboard & analytics endpoints.
5. Webhooks / event streaming.
6. CI/CD pipeline (lint, test, build, scan, deploy).

---
## 6. Testing Strategy
### Layers
- **Unit:** Service layer tests, utility functions.
- **Integration:** Controller tests with MockMvc.
- **E2E (Later):** Cypress or Playwright for frontend flows.

### Key Cases
| Case | Expected |
|------|----------|
| Invalid employee email | 400 VALIDATION (details includes email) |
| Duplicate employee on create | 409 CONFLICT |
| Employee not found | 404 NOT_FOUND |
| Unauthorized request | 401 UNAUTHORIZED |

---
## 7. Immediate Action Plan
1. Complete remaining controller implementations.
2. Add validation annotations to DTOs.
3. Implement exception handlers for consistent error responses.
4. Add test coverage for happy paths and error cases.
5. Configure production-ready logging.
