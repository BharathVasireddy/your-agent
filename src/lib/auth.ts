import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn() {
      // Allow all sign-ins - we'll handle flow in the redirect callback
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // If it's a callback from OAuth, redirect to our flow controller
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/onboarding/welcome`;
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