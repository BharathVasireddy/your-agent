import React from 'react';

type IconProps = {
  className?: string;
  title?: string;
};

export function IconWebsite({ className, title = 'Website' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm7.938 9h-3.465a15.86 15.86 0 0 0-1.2-4.31A8.03 8.03 0 0 1 19.938 11ZM15.9 11H8.1a13.94 13.94 0 0 1 1.41-4.74c.71-1.4 1.5-2.09 2.49-2.09.99 0 1.78.69 2.49 2.09A13.94 13.94 0 0 1 15.9 11Zm-9.373 0H3.062A8.03 8.03 0 0 1 8.727 6.69c-.48 1.03-.89 2.2-1.2 4.31Zm0 2c.31 2.11.72 3.28 1.2 4.31A8.03 8.03 0 0 1 3.062 13h3.465ZM8.1 13h7.8a13.94 13.94 0 0 1-1.41 4.74c-.71 1.4-1.5 2.09-2.49 2.09-.99 0-1.78-.69-2.49-2.09A13.94 13.94 0 0 1 8.1 13Zm9.173 0h3.465A8.03 8.03 0 0 1 16.273 17.31c.48-1.03.89-2.2 1.2-4.31Z"/>
    </svg>
  );
}

export function IconFacebook({ className, title = 'Facebook' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.21 10.44 22v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.21 22 17.06 22 12.07z"/>
    </svg>
  );
}

export function IconInstagram({ className, title = 'Instagram' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10z"/>
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2.1A2.9 2.9 0 119.1 12 2.9 2.9 0 0112 9.1zM17.65 6.35a1.15 1.15 0 11-1.63 1.63 1.15 1.15 0 011.63-1.63z"/>
    </svg>
  );
}

export function IconLinkedIn({ className, title = 'LinkedIn' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.944v5.662H9.086V9h3.112v1.561h.045c.434-.82 1.494-1.686 3.072-1.686 3.288 0 3.894 2.164 3.894 4.979v6.598zM5.337 7.433a1.814 1.814 0 110-3.628 1.814 1.814 0 010 3.628zM6.944 20.452H3.726V9h3.218v11.452z"/>
    </svg>
  );
}

export function IconYouTube({ className, title = 'YouTube' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M23.498 6.186a2.998 2.998 0 00-2.112-2.12C19.296 3.5 12 3.5 12 3.5s-7.296 0-9.386.566a2.998 2.998 0 00-2.112 2.12A31.51 31.51 0 000 12a31.51 31.51 0 00.502 5.814 2.998 2.998 0 002.112 2.12C4.704 20.5 12 20.5 12 20.5s7.296 0 9.386-.566a2.998 2.998 0 002.112-2.12A31.51 31.51 0 0024 12a31.51 31.51 0 00-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/>
    </svg>
  );
}

export function IconTwitterX({ className, title = 'Twitter/X' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={!title} role={title ? 'img' : 'presentation'} className={className}>
      <title className="sr-only">{title}</title>
      <path d="M18.244 2H21L14.5 9.43 22 22h-6.5l-4.06-6.59L6.6 22H4l6.93-7.8L4 2h6.6l3.67 6.02L18.244 2zm-1.14 18h1.53L8.84 4h-1.5l9.764 16z"/>
    </svg>
  );
}


