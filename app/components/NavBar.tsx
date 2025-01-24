/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { config } from "@/lib/constants";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({redirect: false, callbackUrl: config.prodUrl});
    router.push('/')
  }

  const validateToken = useCallback(() => {
    if (session) {
      const sessionExpires = new Date(session.expires);
      const now = new Date();

      if (sessionExpires <= now) {
        console.log("Session expired. Logging out...");
        handleLogout();
      } else {
        console.log("Session is still valid.");
      }
    } else {
      console.log("No session found.");
    }
  }, [session]);

  useEffect(() => {
    validateToken();
  }, [session, validateToken]);

  return (
    <nav className="w-full fixed z-[9999] top-0 left-0 p-8 py-4 flex justify-between items-center shadow-lg">
      <div>
        <Link href={"/dashboard"} className="text-lg font-semibold">
          Auction Sample
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-700">
          Hello, {session?.user?.id}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
