'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type ViewMode = 'cards' | 'table';

export default function PropertiesViewToggle({ initial }: { initial?: ViewMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const mode = ((params.get('view') as ViewMode) || initial || 'cards');

  const setView = (nextMode: ViewMode) => {
    if (nextMode === mode) return;
    const next = new URLSearchParams(params.toString());
    next.set('view', nextMode);
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="inline-flex rounded-lg border border-zinc-200 overflow-hidden">
      <button
        onClick={() => setView('cards')}
        className={`px-3 py-1.5 text-sm ${mode === 'cards' ? 'bg-brand text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
      >
        Cards
      </button>
      <button
        onClick={() => setView('table')}
        className={`px-3 py-1.5 text-sm border-l border-zinc-200 ${mode === 'table' ? 'bg-brand text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
      >
        Table
      </button>
    </div>
  );
}


