// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }

      // Fetch latest user data from DB on every token refresh
      if (token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { username: true, image: true, name: true },
          });

          if (dbUser) {
            token.username = dbUser.username;
            token.image = dbUser.image;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error("Failed to fetch user data for JWT:", error);
          // Keep existing token values on failure — don't break auth
        }
      }

      // Determine if user needs onboarding (no username set)
      token.needsOnboarding = !token.username;

      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.username = token.username || null;
        session.user.image = token.image || null;
        session.user.name = token.name || null;
        session.user.needsOnboarding = token.needsOnboarding || false;
      }
      return session;
    },
  },
};

// NextAuth v4: NextAuth() returns a single handler function
const handler = NextAuth(authOptions);

// Export for Next.js API route
export { handler as GET, handler as POST };

// Re-export signIn and signOut from next-auth for client-side usage
export { signIn, signOut } from "next-auth/react";

// Export getServerSession for server-side usage
export { getServerSession } from "next-auth";