import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ─── Demo Credentials ─────────────────────────────────────────────────────────
// For the PoC, we use a single hardcoded user.
// To upgrade to real users: replace the authorize() body with a DB lookup
// (e.g. prisma.user.findUnique + bcrypt.compare) and add a User model.
// To upgrade to Google OAuth: swap CredentialsProvider for GoogleProvider
// and add the PrismaAdapter — no other code changes needed.

const DEMO_USER = {
  id: "demo-user-001",
  name: "Test User",
  email: "test@team.com",
  image: null,
};

const DEMO_PASSWORD = "password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@team.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (
          credentials?.email === DEMO_USER.email &&
          credentials?.password === DEMO_PASSWORD
        ) {
          return {
            id: DEMO_USER.id,
            name: DEMO_USER.name,
            email: DEMO_USER.email,
            image: DEMO_USER.image,
          };
        }
        // Return null to reject — NextAuth will show an error on the sign-in page
        return null;
      },
    }),
  ],
  session: {
    // JWT strategy: no database session table needed for PoC.
    // Switch to "database" + PrismaAdapter when moving to production.
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist user.id into the JWT on first sign-in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user.id from the JWT to the session object
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// ─── Type augmentation ────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
