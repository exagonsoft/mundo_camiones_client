/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { config } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { LinkType } from "../types/customTypes";
import { getLinks } from "@/lib/utils";

const LinkItem = ({ link }: { link: LinkType }) => (
  <Link
    href={link.href}
    className="flex p-4 py-2 gap-2 justify-center items-center hover:text-gray-600"
  >
    <link.icon width={24} height={24} />
    <span className="">{link.name}</span>
  </Link>
);

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: config.prodUrl });
    router.push("/");
  };

  const validateToken = useCallback(() => {
    if (session) {
      console.log(session.expires);
      
      const sessionExpires = new Date(session.expires).getUTCDate();
      const now = new Date().getUTCDate();

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
    <nav className="w-full fixed z-[50] top-0 left-0 p-8 py-4 flex justify-between items-center shadow-lg bg-[#f7fbff]">
      <div>
        <Link href={session?.user.role === 'admin' ? "/auctioneer/dashboard" : "/client/dashboard"} className="text-lg font-semibold">
          Auction Sample
        </Link>
      </div>
      <div className="flex gap-2 justify-end">
        {getLinks(session?.user.role === "admin").map((link, indx) => (
          <LinkItem link={link} key={indx} />
        ))}
        <div className="flex gap-4 items-center bg-gray-200 rounded-lg p-4 py-2">
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
      </div>
    </nav>
  );
};

export default NavBar;
