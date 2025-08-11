import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCachedSession, getCachedAgentProfile } from '@/lib/dashboard-data';
import { MessageSquare, HelpCircle } from 'lucide-react';

export default async function CustomiseWebsitePage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent profile with relations
  const agent = await getCachedAgentProfile(userId);

  if (!agent) {
    redirect('/subscribe');
  }

  const sections = [
    {
      title: 'Testimonials',
      description: 'Manage client testimonials and reviews that appear on your profile',
      href: '/agent/dashboard/customise-website/testimonials',
      icon: MessageSquare,
      count: agent.testimonials?.length || 0,
      countLabel: 'testimonials'
    },
    {
      title: 'FAQs',
      description: 'Create and manage frequently asked questions for your clients',
      href: '/agent/dashboard/customise-website/faqs',
      icon: HelpCircle,
      count: agent.faqs?.length || 0,
      countLabel: 'questions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Customise Website</h1>
        <p className="text-zinc-600 mt-1">Manage the content that appears on your public profile page</p>
      </div>

      {/* Content Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link
              key={section.title}
              href={section.href}
            className="block bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:border-brand-soft hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-muted rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-950 mb-1">{section.title}</h3>
                  <p className="text-zinc-600 text-sm mb-3">{section.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      {section.count} {section.countLabel}
                    </span>
                    <span className="text-sm text-brand font-medium">
                      Manage →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">About Website Content</h4>
        <p className="text-blue-700 text-sm">
          The content you manage here appears on your public profile page in the same order: 
          Testimonials are displayed first, followed by FAQs. Make sure to keep your content 
          updated and relevant to help potential clients learn more about your services.
        </p>
      </div>
    </div>
  );
}