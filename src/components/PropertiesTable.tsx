'use client';

import Link from 'next/link';

interface Row {
  id: string;
  slug: string | null;
  title: string;
  price: number;
  listingType: string;
  propertyType: string;
  status: string;
  createdAt: string;
}

export default function PropertiesTable({ rows, total, page, pages }: { rows: Row[]; total: number; page: number; pages: number; }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-700">
            <tr>
              <th className="text-left px-3 py-2">Title</th>
              <th className="text-right px-3 py-2">Price</th>
              <th className="text-left px-3 py-2">Listing</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Created</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-zinc-200">
                <td className="px-3 py-2 font-medium text-zinc-900 truncate max-w-[260px]">{p.title}</td>
                <td className="px-3 py-2 text-right">₹{p.price.toLocaleString()}</td>
                <td className="px-3 py-2">{p.listingType}</td>
                <td className="px-3 py-2">{p.propertyType}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {p.slug && (
                    <>
                      <Link href={`/agent/dashboard/properties/${p.slug}/edit`} className="text-blue-600 hover:text-blue-700 mr-3">Edit</Link>
                      <Link href={`/agent/dashboard/properties/${p.slug}/delete`} className="text-red-600 hover:text-red-700">Delete</Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-200 text-sm text-zinc-600">
        <span>Total: {total}</span>
        <div className="space-x-2">
          <PaginationButton page={page - 1} disabled={page <= 1}>Prev</PaginationButton>
          <span>{page} / {pages}</span>
          <PaginationButton page={page + 1} disabled={page >= pages}>Next</PaginationButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({ page, disabled, children }: { page: number; disabled?: boolean; children: React.ReactNode }) {
  const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost');
  url.searchParams.set('page', String(page));
  return (
    <Link
      href={url.pathname + '?' + url.searchParams.toString()}
      className={`px-2 py-1 rounded border ${disabled ? 'text-zinc-400 border-zinc-200 cursor-not-allowed' : 'text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}
      aria-disabled={disabled}
      onClick={(e) => { if (disabled) e.preventDefault(); }}
    >
      {children}
    </Link>
  );
}


