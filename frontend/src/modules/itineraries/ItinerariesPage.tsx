import React, { useEffect, useState } from 'react';
import {
  Employee,
  Itinerary,
  fetchEmployees,
  fetchItineraries,
  createItinerary,
} from '../../lib/api';
import { useItineraryForm } from '../../hooks/useItineraryForm';

interface SegmentDraft {
  from: string;
  to: string;
  departure: string;
  arrival: string;
  carrier: string;
  flightNumber: string;
  seatClass?: string;
}

const emptySegment: SegmentDraft = {
  from: '',
  to: '',
  departure: '',
  arrival: '',
  carrier: '',
  flightNumber: '',
  seatClass: 'economy',
};

export const ItinerariesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newSegment, setNewSegment] = useState<SegmentDraft>(emptySegment);
  const form = useItineraryForm();
  const hasKey = !!import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!hasKey) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [itinData, empData] = await Promise.all([fetchItineraries(), fetchEmployees()]);
        if (!cancelled) {
          setItineraries(itinData);
          setEmployees(empData);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [hasKey]);

  const addSegment = () => {
    if (!newSegment.from || !newSegment.to || !newSegment.departure || !newSegment.arrival) return;
    form.set('segments', [...form.values.segments, newSegment]);
    setNewSegment(emptySegment);
  };

  const removeSegment = (index: number) => {
    form.set(
      'segments',
      form.values.segments.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async () => {
    if (!hasKey || !form.valid) return;
    setCreating(true);
    setCreateError(null);
    try {
      const saved = await createItinerary({
        employeeId: form.values.employeeId,
        purpose: form.values.purpose,
        status: 'draft',
        segments: form.values.segments,
      });
      setItineraries((list) => [saved, ...list]);
      form.reset();
    } catch (e: any) {
      setCreateError(e.message);
    } finally {
      setCreating(false);
    }
  };

  if (!hasKey) {
    return <div className="p-4 text-red-600">API key not configured</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h2 className="text-sm font-semibold">Create Itinerary</h2>
        {createError && <p className="text-xs text-red-600">{createError}</p>}
        <div className="grid md:grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <label htmlFor="employee-select" className="text-slate-600 mb-1">
              Employee
            </label>
            <select
              id="employee-select"
              title="Select employee"
              className="input"
              value={form.values.employeeId}
              onChange={(e) => form.set('employeeId', e.target.value)}
            >
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            {form.errors.employeeId && (
              <span className="text-[10px] text-red-600">{form.errors.employeeId}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-slate-600 mb-1">Purpose</label>
            <input
              className="input"
              placeholder="Trip purpose"
              value={form.values.purpose}
              onChange={(e) => form.set('purpose', e.target.value)}
            />
            {form.errors.purpose && (
              <span className="text-[10px] text-red-600">{form.errors.purpose}</span>
            )}
          </div>
        </div>

        <div className="border-t pt-3">
          <h3 className="text-xs font-medium mb-2">Flight Segments</h3>
          {form.values.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 text-xs mb-1 bg-slate-50 p-2 rounded">
              <span>
                {seg.from} → {seg.to}
              </span>
              <span className="text-slate-500">
                {seg.carrier} {seg.flightNumber}
              </span>
              <button
                type="button"
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => removeSegment(i)}
              >
                Remove
              </button>
            </div>
          ))}
          {form.errors.segments && (
            <span className="text-[10px] text-red-600">{form.errors.segments}</span>
          )}

          <div className="grid grid-cols-6 gap-2 mt-2">
            <input
              className="input"
              placeholder="From (IATA)"
              maxLength={3}
              value={newSegment.from}
              onChange={(e) => setNewSegment({ ...newSegment, from: e.target.value.toUpperCase() })}
            />
            <input
              className="input"
              placeholder="To (IATA)"
              maxLength={3}
              value={newSegment.to}
              onChange={(e) => setNewSegment({ ...newSegment, to: e.target.value.toUpperCase() })}
            />
            <input
              className="input"
              type="datetime-local"
              title="Departure time"
              aria-label="Departure time"
              value={newSegment.departure}
              onChange={(e) => setNewSegment({ ...newSegment, departure: e.target.value })}
            />
            <input
              className="input"
              type="datetime-local"
              title="Arrival time"
              aria-label="Arrival time"
              value={newSegment.arrival}
              onChange={(e) => setNewSegment({ ...newSegment, arrival: e.target.value })}
            />
            <input
              className="input"
              placeholder="Carrier"
              value={newSegment.carrier}
              onChange={(e) =>
                setNewSegment({ ...newSegment, carrier: e.target.value.toUpperCase() })
              }
            />
            <input
              className="input"
              placeholder="Flight #"
              value={newSegment.flightNumber}
              onChange={(e) => setNewSegment({ ...newSegment, flightNumber: e.target.value })}
            />
          </div>
          <button type="button" className="btn-secondary text-xs mt-2" onClick={addSegment}>
            Add Segment
          </button>
        </div>

        <div className="flex gap-2">
          <button
            disabled={creating || !form.valid}
            onClick={handleSubmit}
            className="btn-primary text-xs"
          >
            {creating ? 'Creating...' : 'Create Itinerary'}
          </button>
          <button type="button" className="btn-secondary text-xs" onClick={() => form.reset()}>
            Reset
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Itineraries ({itineraries.length})</h2>
        {itineraries.length === 0 ? (
          <p className="text-sm text-slate-500">No itineraries yet.</p>
        ) : (
          <div className="space-y-2">
            {itineraries.map((itin) => {
              const emp = employees.find((e) => e.id === itin.employeeId);
              return (
                <div key={itin.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{itin.purpose}</p>
                      <p className="text-xs text-slate-500">
                        {emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown employee'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        itin.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : itin.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {itin.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {itin.segments.map((seg, i) => (
                      <span key={seg.id || i}>
                        {i > 0 && ' → '}
                        {seg.from}-{seg.to}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
