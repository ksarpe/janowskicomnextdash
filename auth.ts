import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Szukamy klienta w bazie
        const client = await prisma.client.findUnique({
          where: { email: credentials.email as string },
        });

        if (!client || !client.passwordHash) {
          return null;
        }

        // 2. Weryfikujemy hasło (porównujemy wpisane z zaszyfrowanym w bazie)
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          client.passwordHash,
        );

        if (!passwordsMatch) {
          return null;
        }

        // 3. Zwracamy obiekt użytkownika (to on trafi do tokena sesji JWT)
        // Musimy zmapować id z naszej bazy na pole id, którego oczekuje Auth.js
        return {
          id: client.id,
          email: client.email,
          name: client.companyName || "Użytkownik",
        };
      },
    }),
  ],
  callbacks: {
    // Te funkcje gwarantują, że ID klienta będzie dostępne w każdym miejscu aplikacji
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Powiemy systemowi, że nasz customowy formularz logowania będzie tutaj
  },
});
