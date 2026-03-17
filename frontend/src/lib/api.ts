// Unified API client (employees, itineraries, groups, derived stats).

// Base config with defensive normalization.
// Accept empty / missing env and always fall back to '/api'. Strip trailing slash for consistency.
function resolveApiBase() {
  let b = (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE as string | undefined;
  if (!b || !b.trim()) b = '/api';
  b = b.trim();
  if (b.endsWith('/')) b = b.slice(0, -1);
  return b;
}
const API_BASE = resolveApiBase();
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Input types for creating/updating entities
export type NewEmployeeInput = Omit<Employee, 'id' | 'active' | 'createdAt' | 'updatedAt'>;
export type NewItineraryInput = Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>;

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  title?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlightSegment {
  id?: string; // optional for drafts
  from: string;
  to: string;
  departure: string;
  arrival: string;
  carrier?: string;
  flightNumber?: string;
  seatClass?: string;
}

export interface Itinerary {
  id: string;
  employeeId: string;
  purpose: string;
  status: string;
  segments: FlightSegment[];
  createdAt: string;
  updatedAt?: string;
}

export interface IATACode {
  code: string;
  name: string;
  city?: string;
  country?: string;
}

// Helper: build URL preventing double /api/api prefix
function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.startsWith('/api')) {
    return normalized;
  }
  return `${API_BASE}${normalized}`;
}

// Helper: construct headers with API key
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }
  return headers;
}

// Helper: parse response and throw on error
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { error?: { message?: string }; message?: string } | undefined;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
    throw new Error(errorMessage);
  }
  return response.json();
}

// ============================================================================
// EMPLOYEES API
// ============================================================================

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(buildUrl('/api/employees'), {
    headers: getHeaders(),
  });
  return handleResponse<Employee[]>(response);
}

// Alias for backwards compatibility
export const listEmployees = fetchEmployees;

export async function fetchEmployee(id: string): Promise<Employee> {
  const response = await fetch(buildUrl(`/api/employees/${id}`), {
    headers: getHeaders(),
  });
  return handleResponse<Employee>(response);
}

export async function createEmployee(data: Omit<Employee, 'id' | 'active' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
  const response = await fetch(buildUrl('/api/employees'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(response);
}

export async function updateEmployee(id: string, data: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Employee> {
  const response = await fetch(buildUrl(`/api/employees/${id}`), {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(response);
}

export async function deleteEmployee(id: string): Promise<void> {
  const response = await fetch(buildUrl(`/api/employees/${id}`), {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete employee: ${response.statusText}`);
  }
}

/**
 * Get employee avatar URL (returns the actual image endpoint).
 * The backend will return either a custom uploaded image or a generated identicon.
 */
export function getEmployeeAvatarUrl(id: string): string {
  return buildUrl(`/api/employees/${id}/avatar`);
}

/**
 * Upload a custom avatar for an employee.
 * Accepts PNG, JPEG, or WebP image files (max 2MB).
 */
export async function uploadEmployeeAvatar(id: string, file: File): Promise<{ message: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = {};
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  const response = await fetch(buildUrl(`/api/employees/${id}/avatar`), {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse<{ message: string; path: string }>(response);
}

// ============================================================================
// ITINERARIES API
// ============================================================================

export async function fetchItineraries(filters?: { employeeId?: string; status?: string }): Promise<Itinerary[]> {
  let url = buildUrl('/api/itineraries');
  if (filters) {
    const params = new URLSearchParams();
    if (filters.employeeId) params.set('employeeId', filters.employeeId);
    if (filters.status) params.set('status', filters.status);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }
  
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  return handleResponse<Itinerary[]>(response);
}

export async function fetchItinerary(id: string): Promise<Itinerary> {
  const response = await fetch(buildUrl(`/api/itineraries/${id}`), {
    headers: getHeaders(),
  });
  return handleResponse<Itinerary>(response);
}

export async function createItinerary(data: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Itinerary> {
  const response = await fetch(buildUrl('/api/itineraries'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Itinerary>(response);
}

export async function updateItinerary(id: string, data: Partial<Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Itinerary> {
  const response = await fetch(buildUrl(`/api/itineraries/${id}`), {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Itinerary>(response);
}

export async function deleteItinerary(id: string): Promise<void> {
  const response = await fetch(buildUrl(`/api/itineraries/${id}`), {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete itinerary: ${response.statusText}`);
  }
}


