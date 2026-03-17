import React, { useState } from 'react';
import { EmployeesPage } from '../employees/EmployeesPage';
import { ItinerariesPage } from '../itineraries/ItinerariesPage';

type View = 'employees' | 'itineraries';

export const App: React.FC = () => {
  const [view, setView] = useState<View>('employees');
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">Flight Planner</h1>
        <nav className="flex gap-2 text-xs">
          {(['employees','itineraries'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded border transition ${view===v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >{v.charAt(0).toUpperCase()+v.slice(1)}</button>
          ))}
        </nav>
      </header>
      <main className="p-4 flex-1 space-y-8">
        {view === 'employees' && <EmployeesPage />}
        {view === 'itineraries' && <ItinerariesPage />}
      </main>
      <footer className="p-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Flight Planner</footer>
    </div>
  );
};
