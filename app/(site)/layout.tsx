"use client";

import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import React from "react";


export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className={`relative antialiased p-8 pt-[6rem]`}>
        <NavBar />
        {children}
      </div>
    </SessionProvider>
  );
}
