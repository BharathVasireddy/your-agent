import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { adminNavItems } from './nav-items';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-zinc-200">
        <div className="px-4 h-14 flex items-center font-semibold">Admin</div>
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 text-sm">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + desktop) */}
        <header className="h-14 border-b border-zinc-200 flex items-center px-4 justify-between md:justify-end">
          {/* Mobile menu button */}
          <details className="md:hidden">
            <summary className="list-none cursor-pointer select-none rounded-md border border-zinc-200 px-3 py-1.5 text-sm">Menu</summary>
            <div className="absolute left-4 right-4 mt-2 rounded-md border border-zinc-200 bg-white shadow-lg p-2">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </header>

        <main className="px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}


