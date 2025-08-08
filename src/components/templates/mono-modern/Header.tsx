import React from 'react';

export default function Header({ agent }: { agent: { user: { name: string | null }; slug: string } }) {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-zinc-900 uppercase">
          {agent.user.name || 'Agent'}
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-700">
          <a href={`/${agent.slug}#properties`} className="hover:text-zinc-950">Properties</a>
          <a href={`/${agent.slug}#about`} className="hover:text-zinc-950">About</a>
          <a href={`/${agent.slug}#testimonials`} className="hover:text-zinc-950">Testimonials</a>
          <a href={`/${agent.slug}#faqs`} className="hover:text-zinc-950">FAQs</a>
          <a href={`/${agent.slug}#contact`} className="hover:text-zinc-950">Contact</a>
        </nav>
      </div>
    </header>
  );
}


