import Link from 'next/link';
import Image from 'next/image';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
}

export default function AuthPageLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
}: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center mb-6">
            <Image
              src="/images/Your-Agent-Logo.png"
              alt="YourAgent"
              width={200}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-950">{title}</h1>
          <p className="mt-2 text-zinc-600">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
          {children}
        </div>

        {/* Footer */}
        {footerText && footerLink && footerLinkText ? (
          <div className="text-center">
            <p className="text-sm text-zinc-600">
              {footerText}{' '}
              <Link href={footerLink} className="text-red-600 hover:text-red-700 font-medium">
                {footerLinkText}
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
