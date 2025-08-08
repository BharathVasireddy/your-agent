import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-600 flex items-center justify-between">
        <div>© {new Date().getFullYear()} YourAgent</div>
        <div className="space-x-4">
          <a href="#" className="hover:text-zinc-900">Terms</a>
          <a href="#" className="hover:text-zinc-900">Privacy</a>
        </div>
      </div>
    </footer>
  );
}


