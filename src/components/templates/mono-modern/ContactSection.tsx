import React from 'react';

type Agent = {
  phone: string | null;
  user: { email: string | null };
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
};

export default function ContactSection({ agent }: { agent: Agent }) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 border-t border-zinc-200">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">Contact</h2>
        </div>
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`tel:${agent.phone ?? ''}`} className="block border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50">
              <div className="text-sm text-zinc-600">Phone</div>
              <div className="mt-1 font-medium text-zinc-950">{agent.phone || 'Not provided'}</div>
            </a>
            <a href={`mailto:${agent.user.email ?? ''}`} className="block border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50">
              <div className="text-sm text-zinc-600">Email</div>
              <div className="mt-1 font-medium text-zinc-950">{agent.user.email || 'Not provided'}</div>
            </a>
          </div>

          {(agent.websiteUrl || agent.facebookUrl || agent.instagramUrl || agent.linkedinUrl || agent.youtubeUrl || agent.twitterUrl) && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm text-zinc-600">Social</span>
              <div className="flex items-center gap-2">
                {agent.websiteUrl && (
                  <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="Website">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
                  </a>
                )}
                {agent.facebookUrl && (
                  <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.21 10.44 22v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.21 22 17.06 22 12.07z"/></svg>
                  </a>
                )}
                {agent.instagramUrl && (
                  <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10z"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2.1A2.9 2.9 0 119.1 12 2.9 2.9 0 0112 9.1zM17.65 6.35a1.15 1.15 0 11-1.63 1.63 1.15 1.15 0 011.63-1.63z"/></svg>
                  </a>
                )}
                {agent.linkedinUrl && (
                  <a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.944v5.662H9.086V9h3.112v1.561h.045c.434-.82 1.494-1.686 3.072-1.686 3.288 0 3.894 2.164 3.894 4.979v6.598zM5.337 7.433a1.814 1.814 0 110-3.628 1.814 1.814 0 010 3.628zM6.944 20.452H3.726V9h3.218v11.452z"/></svg>
                  </a>
                )}
                {agent.youtubeUrl && (
                  <a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="YouTube">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a2.998 2.998 0 00-2.112-2.12C19.296 3.5 12 3.5 12 3.5s-7.296 0-9.386.566a2.998 2.998 0 00-2.112 2.12A31.51 31.51 0 000 12a31.51 31.51 0 00.502 5.814 2.998 2.998 0 002.112 2.12C4.704 20.5 12 20.5 12 20.5s7.296 0 9.386-.566a2.998 2.998 0 002.112-2.12A31.51 31.51 0 0024 12a31.51 31.51 0 00-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
                  </a>
                )}
                {agent.twitterUrl && (
                  <a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md" aria-label="Twitter/X">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2H21L14.5 9.43 22 22h-6.5l-4.06-6.59L6.6 22H4l6.93-7.8L4 2h6.6l3.67 6.02L18.244 2zm-1.14 18h1.53L8.84 4h-1.5l9.764 16z"/></svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


