"use client";

import { Auction } from "@/app/types/auction";
import { mockAuctions } from "@/mocks/mockAuctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For App Router in Next.js 13+
import React from "react";

// AuctionItem component
const AuctionItem = ({
  auction,
  onClick,
}: {
  auction: Auction;
  onClick: (auctionId: string) => void;
}) => {
  return (
    <div
      className="cursor-pointer p-4 border rounded shadow hover:bg-gray-200"
      onClick={() => onClick(auction.id)}
    >
      <h2 className="text-lg font-bold">{auction.id}</h2>
      <p>{auction.lots.length} lots available</p>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuctionClick = (auctionId: string) => {
    console.log(`Auction ${auctionId} clicked`);

    if (session?.user?.role === "admin") {
      router.push(`/auctioneer/${auctionId}`);
    } else if (session?.user?.role === "user") {
      router.push(`/client/${auctionId}`);
    } else {
      console.error("Error: The user role is not recognized");
    }
  };

  return (
    <section className="p-6 space-y-4">
      {mockAuctions.map((auction, indx) => (
        <AuctionItem
          key={indx}
          auction={auction}
          onClick={handleAuctionClick}
        />
      ))}
    </section>
  );
};

export default Dashboard;
