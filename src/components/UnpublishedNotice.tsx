import Link from 'next/link';

interface UnpublishedNoticeProps {
  variant: 'public' | 'owner';
  agentSlug?: string;
}

// Light-mode, brand-aligned unpublished notice
export default function UnpublishedNotice({ variant, agentSlug }: UnpublishedNoticeProps) {
  const isPublic = variant === 'public';

  return (
    <main className="bg-white">
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#FFDCCF] mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-brand" aria-hidden>
            <path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5m-3 8V7a3 3 0 1 1 6 0v3z"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-zinc-950 mb-3">
          {isPublic ? 'Profile not published' : 'Your profile is unpublished'}
        </h1>
        <p className="text-zinc-600 max-w-xl mx-auto">
          {isPublic
            ? 'This agent profile is currently unavailable. The owner may have an inactive subscription.'
            : 'Renew your subscription to publish your profile and make it visible to everyone.'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {isPublic ? (
            <>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 rounded-md border border-zinc-300 text-zinc-800 hover:bg-zinc-50"
              >
                Back to Home
              </Link>
              {agentSlug && (
                <Link
                  href={`/${agentSlug}?view=public`}
                  className="hidden"
                >
                  View public
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/agent/dashboard/subscription"
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand text-white hover:bg-brand-hover"
              >
                Renew subscription
              </Link>
              <Link
                href="/agent/dashboard"
                className="inline-flex items-center px-4 py-2 rounded-md border border-zinc-300 text-zinc-800 hover:bg-zinc-50"
              >
                Go to dashboard
              </Link>
            </>
          )}
        </div>

        {isPublic && (
          <div className="mt-8 text-sm text-zinc-500">
            If you believe this is an error, please contact the profile owner.
          </div>
        )}
      </section>
    </main>
  );
}


