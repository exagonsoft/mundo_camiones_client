/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ClientAuctionDashboardItem from "@/app/components/auctions/clientAuctionDashboardItem";
import { AuctionDetail, Vehicle } from "@/app/types/auction";
import { getAuctionDetails, getAuctions, getVehicles } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

// Dashboard component
const ClientDashboard = () => {
  const [auctions, setAuctions] = useState<AuctionDetail[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[] | null>([]);
  const { data: session } = useSession();

  const fetchDependencies = async () => {
    try {
      if (!session) return;

      const [_auctions, _vehicles] = await Promise.all([
        getAuctions(session.user.accessToken.access_token),
        getVehicles(session.user.accessToken.access_token),
      ]);

      // Fetch auction details and filter out null values
      const _auctionDetails: AuctionDetail[] = (
        await Promise.all(
          _auctions.data?.map(async (_auctionDetail) => {
            const _details = await getAuctionDetails(
              _auctionDetail._id,
              session.user.accessToken.access_token
            );
            return _details.data ?? null; // Ensure null is returned if no data
          }) ?? []
        )
      ).filter((_detail): _detail is AuctionDetail => _detail !== null); // Remove null values

      // Update state with resolved values
      setAuctions(_auctionDetails);
      setVehicles(_vehicles.data);
    } catch (error) {
      console.warn("Error fetching client dashboard dependencies", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDependencies();
    }
  }, [session?.user.accessToken, auctions]);

  return (
    <section
      id="client-dashboard"
      className="p-6 space-y-4 flex flex-col gap-4 relative"
    >
      <div className="w-full flex justify-end p-4"></div>
      <div className="w-full p-4 flex flex-col gap-6">
        {auctions.map((_auction, indx) => (
          <ClientAuctionDashboardItem key={indx} auction={_auction} />
        ))}
        {vehicles?.map((_vehicle, indx) => (
          <div key={indx} className=""></div>
        ))}
      </div>
    </section>
  );
};

export default ClientDashboard;
