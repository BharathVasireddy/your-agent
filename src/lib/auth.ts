import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { recordAuthEvent } from '@/lib/auth-events';

// Note: Using loose typing to maintain compatibility across NextAuth versions
export const authOptions: {
  // minimal shape we need; fallback to any to avoid type drift
  [key: string]: unknown;
} = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Temporarily disable subdomain cookies to fix auth
        domain: undefined,
      },
    },
  },
  callbacks: {
    async signIn({ user, account, email, credentials }: { user?: { id?: string; email?: string | null }; account?: { provider?: string }; email?: string; credentials?: Record<string, unknown> | undefined }) {
      try {
        await recordAuthEvent({
          type: 'SIGNIN_SUCCESS',
          userId: user?.id,
          identifier: user?.email ?? email ?? (credentials as unknown as { identifier?: string })?.identifier,
          metadata: { provider: account?.provider },
        });
      } catch {}
      // Allow all sign-ins - we'll handle flow in the redirect callback
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Handle sign-out - redirect to home page
      if (url.includes('/api/auth/signout')) {
        return `${baseUrl}/`;
      }
      
      // Handle explicit home page redirects
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/`;
      }
      
      // Allow smart redirect endpoint specifically
      if (url === '/api/auth/post-signin-redirect') {
        return `${baseUrl}/api/auth/post-signin-redirect`;
      }
      
      // If user is trying to access a specific page, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default to centralized post-signin redirect
      return `${baseUrl}/api/auth/post-signin-redirect`;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: ({ session, token }: { session: any; token: any }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      id: 'whatsapp',
      name: 'whatsapp',
      credentials: {
        identifier: { label: 'Phone', type: 'text' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.token) return null;
          const identifier = credentials.identifier as string; // phone E.164
          const rawToken = credentials.token as string;
          const crypto = await import('crypto');
          const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
          // Use VerificationToken as a one-time login token store
          const tokenRecord = await prisma.verificationToken.findFirst({
            where: { identifier, token: hash, expires: { gt: new Date() } },
          });
          if (!tokenRecord) return null;
          // consume token
          await prisma.verificationToken.delete({ where: { token: tokenRecord.token } });
          // Find user by phone - use findFirst since findUnique might not work if phone field isn't properly indexed
          const user = await prisma.user.findFirst({ where: { phone: identifier } });
          if (!user) {
            console.log('WhatsApp auth: No user found with phone:', identifier);
            try { await recordAuthEvent({ type: 'SIGNIN_FAILED', identifier, metadata: { provider: 'whatsapp', reason: 'user_not_found' } }); } catch {}
            return null;
          }
          try { await recordAuthEvent({ type: 'SIGNIN_SUCCESS', userId: user.id, identifier, metadata: { provider: 'whatsapp' } }); } catch {}
          return { id: user.id, email: user.email, name: user.name, image: user.image };
        } catch (error) {
          console.error('WhatsApp auth provider error:', error);
          try { await recordAuthEvent({ type: 'SIGNIN_FAILED', metadata: { provider: 'whatsapp', error: String(error).slice(0, 1000) } }); } catch {}
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
};

// @ts-expect-error NextAuth v4 type compatibility issue
const handler = NextAuth(authOptions);

export { handler };
export default authOptions;