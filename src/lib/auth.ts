import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn() {
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
      
      // Default to welcome page for new sign-ins
      return `${baseUrl}/onboarding/welcome`;
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
            return null;
          }
          return { id: user.id, email: user.email, name: user.name, image: user.image };
        } catch (error) {
          console.error('WhatsApp auth provider error:', error);
          return null;
        }
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { accounts: true }
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
          // User exists but has no password (signed up with OAuth)
          const hasGoogle = user.accounts.some(acc => acc.provider === "google");
          if (hasGoogle) {
            console.log(`User ${credentials.email} tried password login but only has Google auth`);
            throw new Error("GOOGLE_ONLY_ACCOUNT");
          }
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),
  ],
  session: { strategy: "jwt" as const },
};

// @ts-expect-error NextAuth v4 type compatibility issue
const handler = NextAuth(authOptions);

export { handler };
export default authOptions;