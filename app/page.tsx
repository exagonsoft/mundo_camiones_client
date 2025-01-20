"use client"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 p-8 pt-32 items-center">
      <div className="home">
        <h1>Welcome to the Auction System</h1>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>
    </main>
  );
}