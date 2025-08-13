import { redirect } from 'next/navigation';
import { getCachedSession, getCachedAgentProfile } from '@/lib/dashboard-data';
import SeoSettings from './SeoSettings';

export default async function SeoSettingsPage() {
  const raw = await getCachedSession();
  const session = raw as { user?: { id?: string } } | null;
  if (!session?.user?.id) redirect('/login');

  const agent = await getCachedAgentProfile(session.user.id as string);
  if (!agent) redirect('/subscribe');

  const seo = ((agent as unknown as { templateData?: unknown }).templateData as
    | { seo?: { metaTitle?: string; metaDescription?: string } }
    | null
    | undefined)?.seo || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">SEO Settings</h1>
        <p className="text-zinc-600">Set your site&apos;s meta title and description for search engines.</p>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6">
        <SeoSettings agentSlug={agent.slug} initial={{ metaTitle: seo.metaTitle || '', metaDescription: seo.metaDescription || '' }} />
      </div>
    </div>
  );
}


