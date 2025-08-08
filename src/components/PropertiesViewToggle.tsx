'use client';

import { useEffect, useState } from 'react';

type ViewMode = 'cards' | 'table';

export default function PropertiesViewToggle({ initial }: { initial?: ViewMode }) {
  const [mode, setMode] = useState<ViewMode>(initial || 'cards');

  useEffect(() => {
    const saved = localStorage.getItem('properties_view_mode') as ViewMode | null;
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('properties_view_mode', mode);
    const url = new URL(window.location.href);
    url.searchParams.set('view', mode);
    window.history.replaceState(null, '', url.toString());
  }, [mode]);

  return (
    <div className="inline-flex rounded-lg border border-zinc-200 overflow-hidden">
      <button
        onClick={() => setMode('cards')}
        className={`px-3 py-1.5 text-sm ${mode === 'cards' ? 'bg-red-600 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
      >
        Cards
      </button>
      <button
        onClick={() => setMode('table')}
        className={`px-3 py-1.5 text-sm border-l border-zinc-200 ${mode === 'table' ? 'bg-red-600 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
      >
        Table
      </button>
    </div>
  );
}


