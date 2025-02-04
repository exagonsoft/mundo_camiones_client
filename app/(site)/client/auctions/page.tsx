/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AuctionClientListItem from "@/app/components/auctions/auctionClientListItem";
import { Auction } from "@/app/types/auction";
import { getAuctions } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const ClientAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const { data: session } = useSession();

  const fetchAuctions = async () => {
    try {
      if (session?.user.accessToken) {
        const { data, errors } = await getAuctions(
          session.user.accessToken.access_token
        );
        if (!errors) {
          setAuctions(data!);
        }
      }
    } catch (error) {
      console.warn("Error Getting Vehicles: ", error);
    }
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchAuctions();
    }
  }, [session]);
  return (
    <section
      id="auctions-section"
      className="p-6 space-y-4 flex flex-col gap-4 relative"
    >
      <div className="w-full flex justify-end"></div>
      <div className="w-full  flex flex-col gap-4">
        {auctions.map((auction, indx) => (
          <AuctionClientListItem
            key={indx}
            auction={auction}
            session={session || undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default ClientAuctions;
