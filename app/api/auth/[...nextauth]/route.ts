/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "@/lib/constants";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "mundo_camiones_secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${config.baseAuthUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) {
            throw new Error("Invalid username or password");
          }

          const user = await res.json();
          if (user) {
            return user;
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
        return null; // Authentication failed
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.id,
        role: token.role,
        accessToken: token.accessToken, // Use token directly
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
