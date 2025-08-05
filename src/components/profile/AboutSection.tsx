'use client';

interface AboutSectionProps {
  bio: string | null;
}

export default function AboutSection({ bio }: AboutSectionProps) {
  if (!bio) {
    return null; // Don't render anything if there's no bio
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
        About Me
      </h2>
      <p className="text-muted-foreground leading-relaxed font-serif">
        {bio}
      </p>
    </div>
  );
}