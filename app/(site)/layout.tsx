"use client";

import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import { WebSocketProvider } from "../contexts/webSocketContext";
import React from "react";


export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <main className={`relative antialiased p-8 pt-32`}>
        <NavBar />
        <WebSocketProvider>{children}</WebSocketProvider>
      </main>
    </SessionProvider>
  );
}
