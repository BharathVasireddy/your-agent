import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, MessageSquare, BookOpen, LifeBuoy } from 'lucide-react';

export default async function HelpSupportPage() {
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    redirect('/login');
  }

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <LifeBuoy className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-zinc-950">Help & Support</h1>
        </div>
        <p className="text-zinc-600 mb-6">We’re here to help. Choose an option below or contact us directly.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="mailto:support@youragent.in" className="block bg-white rounded-lg border border-zinc-200 p-5 hover:border-brand-soft hover:bg-brand-light transition-colors">
            <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-brand" />
              <div>
                <h3 className="font-semibold text-zinc-900">Email Support</h3>
                <p className="text-sm text-zinc-600">support@youragent.in</p>
              </div>
            </div>
          </Link>

          <Link href="/agent/dashboard/messages" className="block bg-white rounded-lg border border-zinc-200 p-5 hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-zinc-600" />
              <div>
                <h3 className="font-semibold text-zinc-900">Contact Form</h3>
                <p className="text-sm text-zinc-600">Send us a message</p>
              </div>
            </div>
          </Link>

          <Link href="/agent/dashboard/resources" className="block bg-white rounded-lg border border-zinc-200 p-5 hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-zinc-600" />
              <div>
                <h3 className="font-semibold text-zinc-900">Guides & Docs</h3>
                <p className="text-sm text-zinc-600">Best practices and tutorials</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}


