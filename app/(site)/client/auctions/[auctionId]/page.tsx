"use client";

import ClientView from "@/app/components/ClientView";
import { useParams } from "next/navigation";

const ClientPage = () => {
  const {auctionId} = useParams<{auctionId: string}>();

  if (!auctionId) {
    return <div>Error: Auction ID not found</div>;
  }

  return <ClientView auctionIdentifier={auctionId} />;
};

export default ClientPage;
