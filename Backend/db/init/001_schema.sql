-- Flight Planner Database Schema
-- This schema matches the frontend data structures

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- EMPLOYEES
-- ============================================================================
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_active ON employees(active);

-- ============================================================================
-- AVATAR TODO: må opprette tabell for lagring av avatar med foreign key til employee (mot ID i employee)
-- ============================================================================

-- ============================================================================
-- ITINERARIES
-- ============================================================================
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    purpose VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'booked', 'traveling', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itineraries_employee_id ON itineraries(employee_id);
CREATE INDEX idx_itineraries_status ON itineraries(status);

-- ============================================================================
-- FLIGHT SEGMENTS
-- ============================================================================
CREATE TABLE flight_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    segment_order INTEGER NOT NULL,
    from_airport VARCHAR(3) NOT NULL,  -- IATA code
    to_airport VARCHAR(3) NOT NULL,    -- IATA code
    departure TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    carrier VARCHAR(10) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    seat_class VARCHAR(20) NOT NULL DEFAULT 'economy'
        CHECK (seat_class IN ('economy', 'premium', 'business', 'first')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TODO: IATA for flyplasskoder OSL, LHR, SFO etc.
--  (bruke internett og implementere slik at man kan velge flyplasser også) statisk/virtuell tabell
-- ============================================================================

CREATE INDEX idx_flight_segments_itinerary_id ON flight_segments(itinerary_id);
CREATE INDEX idx_flight_segments_departure ON flight_segments(departure);

-- ============================================================================
-- GROUPS (for group travel)
-- ============================================================================
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Junction table for group members
CREATE TABLE group_members (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, employee_id)
);

-- Junction table for group itineraries
CREATE TABLE group_itineraries (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, itinerary_id)
);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
