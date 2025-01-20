"use client"

import { useSession } from "next-auth/react";
import AuctionManager from "../../../components/Auctioneer";
import { useParams } from "next/navigation";

const ManagerPage = () => {
  const {data: session} = useSession();
  const {auctionId} = useParams<{auctionId: string}>();

  if (!session || session.user?.role !== "admin") {
    return <div>Unauthorized</div>;
  }

  if (!auctionId) {
    return <div>Error: Auction ID not provided</div>;
  }

  return <AuctionManager auctionId={auctionId} />;
};

export default ManagerPage;
