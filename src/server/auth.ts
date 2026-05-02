import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/server/mock/authenticate";

function safeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name;
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        if (token.sub) {
          (session.user as { id?: string }).id = token.sub;
        }
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = safeString(credentials?.email).trim().toLowerCase();
        const password = safeString(credentials?.password);

        if (!email || !password) return null;
        return authenticateUser(email, password);
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

