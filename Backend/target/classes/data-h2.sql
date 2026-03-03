-- Seed data for H2 in-memory database

-- Sample employees
INSERT INTO employees (id, first_name, last_name, email, department, title, active, created_at, updated_at) VALUES
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Alice', 'Johnson', 'alice.johnson@company.com', 'Engineering', 'Senior Developer', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Bob', 'Smith', 'bob.smith@company.com', 'Sales', 'Account Manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Carol', 'Williams', 'carol.williams@company.com', 'Engineering', 'Tech Lead', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'David', 'Brown', 'david.brown@company.com', 'Marketing', 'Marketing Director', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'Eve', 'Davis', 'eve.davis@company.com', 'HR', 'HR Manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample itineraries
INSERT INTO itineraries (id, employee_id, purpose, status, created_at, updated_at) VALUES
    ('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Tech Conference 2026', 'BOOKED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Client Meeting', 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample flight segments
INSERT INTO flight_segments (id, itinerary_id, segment_order, from_airport, to_airport, departure, arrival, carrier, flight_number, seat_class, created_at) VALUES
    (RANDOM_UUID(), 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 1, 'OSL', 'LHR', '2026-03-15 08:00:00+01:00', '2026-03-15 09:30:00+00:00', 'SK', 'SK805', 'BUSINESS', CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 2, 'LHR', 'SFO', '2026-03-15 12:00:00+00:00', '2026-03-15 15:00:00-08:00', 'BA', 'BA287', 'BUSINESS', CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 3, 'SFO', 'LHR', '2026-03-20 18:00:00-08:00', '2026-03-21 12:00:00+00:00', 'BA', 'BA286', 'BUSINESS', CURRENT_TIMESTAMP),
    (RANDOM_UUID(), 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 4, 'LHR', 'OSL', '2026-03-21 14:00:00+00:00', '2026-03-21 17:00:00+01:00', 'SK', 'SK806', 'BUSINESS', CURRENT_TIMESTAMP);

-- Sample group
INSERT INTO groups (id, name, description, created_at, updated_at) VALUES
    ('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'Conference Team', 'Team attending Tech Conference 2026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Group members
INSERT INTO group_members (group_id, employee_id) VALUES
    ('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'),
    ('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f');

-- Group itineraries
INSERT INTO group_itineraries (group_id, itinerary_id) VALUES
    ('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c');
