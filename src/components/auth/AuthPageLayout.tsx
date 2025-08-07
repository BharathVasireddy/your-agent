import Link from 'next/link';
import { Home } from 'lucide-react';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
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
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-950">YourAgent</span>
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
        <div className="text-center">
          <p className="text-sm text-zinc-600">
            {footerText}{' '}
            <Link href={footerLink} className="text-red-600 hover:text-red-700 font-medium">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
