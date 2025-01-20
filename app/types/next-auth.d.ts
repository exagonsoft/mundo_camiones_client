/* eslint-disable @typescript-eslint/no-unused-vars */
// /types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    access_token: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      accessToken: {access_token: string; role: string; user: string};
    };
  }

  interface JWT {
    id: string;
    role: string;
    accessToken: {access_token: string; role: string; user: string};
  }
}