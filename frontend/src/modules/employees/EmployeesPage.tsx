import React, { useEffect, useState } from 'react';

import { listEmployees, Employee, createEmployee } from '../../lib/api';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';

export const EmployeesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const form = useEmployeeForm();
  const hasKey = !!import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!hasKey) { setEmployees([]); return; }
    let cancelled = false;
    const run = async () => {
      setLoading(true); setError(null);
      try {
        const data = await listEmployees();
        if(!cancelled) setEmployees(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally { if (!cancelled) setLoading(false); }
    };
    run();
    return () => { cancelled = true; };
  }, [hasKey]);

  const filtered = employees.filter(e => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      (e.department && e.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <section className="p-4 border rounded bg-white space-y-3">
        <h2 className="text-sm font-semibold">Add Employee</h2>
        {createError && <p className="text-xs text-red-600">{createError}</p>}
        <div className="grid md:grid-cols-5 gap-2 text-xs">
          <div className="flex flex-col">
            <input className="input" placeholder="First name" value={form.values.firstName} onChange={e=>form.set('firstName', e.target.value)} />
            {form.errors.firstName && <span className="text-[10px] text-red-600">{form.errors.firstName}</span>}
          </div>
          <div className="flex flex-col">
            <input className="input" placeholder="Last name" value={form.values.lastName} onChange={e=>form.set('lastName', e.target.value)} />
            {form.errors.lastName && <span className="text-[10px] text-red-600">{form.errors.lastName}</span>}
          </div>
          <div className="flex flex-col md:col-span-2">
            <input className="input" placeholder="Email" value={form.values.email} onChange={e=>form.set('email', e.target.value)} />
            {form.errors.email && <span className="text-[10px] text-red-600">{form.errors.email}</span>}
          </div>
          <div className="flex flex-col">
            <input className="input" placeholder="Department" value={form.values.department} onChange={e=>form.set('department', e.target.value)} />
          </div>
          <div className="flex flex-col">
            <input className="input" placeholder="Title" value={form.values.title} onChange={e=>form.set('title', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            disabled={creating || !form.valid || !form.values.department || !form.values.title}
            onClick={async ()=>{
              if (!hasKey) return;
              setCreating(true); setCreateError(null);
              const optimistic: Employee = {
                id: 'tmp-'+Date.now(),
                firstName: form.values.firstName.trim(),
                lastName: form.values.lastName.trim(),
                email: form.values.email.trim(),
                department: form.values.department?.trim(),
                title: form.values.title?.trim(),
                active: true,
                createdAt: new Date().toISOString()
              };
              setEmployees(list => [optimistic, ...list]);
              try {
                const saved = await createEmployee(form.values);
                setEmployees(list => list.map(e => e.id === optimistic.id ? saved : e));
                form.reset();
              } catch (e: any) {
                setCreateError(e.message);
                setEmployees(list => list.filter(e => e.id !== optimistic.id));
              } finally { setCreating(false); }
            }}
            className="btn-primary text-xs px-3 py-1"
          >{creating ? 'Adding...' : 'Add'}</button>
          <button type="button" className="btn-secondary text-xs" onClick={()=>form.reset()}>Reset</button>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter (navn / avdeling)"
            className="flex-1 rounded border px-3 py-2 text-sm"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            disabled={loading}
          />
          <span className="text-xs text-slate-500">{filtered.length} / {employees.length}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {loading && <div className="col-span-full text-sm text-slate-500">Laster...</div>}
          {error && <div className="col-span-full text-sm text-red-600">Feil: {error}</div>}
          {!loading && !error && filtered.map(emp => (
            <article key={emp.id} className="card space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_API_BASE || '/api'}/employees/${emp.id}/avatar`}
                  alt={emp.firstName}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full ring-1 ring-slate-200 object-cover bg-white"
                  loading="lazy"
                />
                <h3 className="font-medium">{emp.firstName} {emp.lastName}</h3>
              </div>
              <p className="text-xs text-slate-600">{emp.title} • {emp.department}</p>
              <p className="text-[10px] uppercase tracking-wide font-medium mt-2 inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {emp.active ? 'Active' : 'Inactive'}
              </p>
            </article>
          ))}
          {!loading && !error && hasKey && filtered.length === 0 && (
            <div className="col-span-full text-sm text-slate-500">Ingen treff.</div>
          )}
          {!hasKey && (
            <div className="col-span-full text-sm text-slate-400">Ingen VITE_API_KEY satt i .env – legg til for å laste eller opprette ansatte.</div>
          )}
        </div>
      </section>
    </div>
  );
};
