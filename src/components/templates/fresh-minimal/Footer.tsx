'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-template-background border-t border-template-border-light py-8">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="text-center">
          <p className="text-template-text-muted font-template-primary text-sm">
            © {currentYear} Professional Real Estate Services. All rights reserved.
          </p>
          <p className="text-template-text-muted font-template-primary text-xs mt-2">
            Designed for excellence in real estate.
          </p>
        </div>
      </div>
    </footer>
  );
}