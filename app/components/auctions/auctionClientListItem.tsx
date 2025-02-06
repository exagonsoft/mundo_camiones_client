"use client";
import { Auction } from "@/app/types/auction";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ActiveRenderer from "../ui/activeRenderer";
import ActionLink from "../ui/actionLink";

const AuctionClientListItem = ({
  auction,
  session,
}: {
  auction: Auction;
  session?: Session;
}) => {
  useEffect(() => {}, [session]);
  return (
    <div className="w-full flex justify-between items-center rounded-lg shadow-md p-4">
      <div className="w-3/4 flex justify-between items-center text-sm">
        <div className="w-1/4 flex justify-start items-start flex-col">
          <span className="">{auction._id}</span>
          <span className="text-[.6rem] font-bold">{`Cantidad de Lotes: ${auction.vehicles.length}`}</span>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          {new Date(auction.endDate).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <ActiveRenderer active={auction.active} />
        </div>
        <div className="w-1/4 flex justify-center items-center">
          {new Date(auction.endDate).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
        <div className="w-1/4 flex justify-center items-center"></div>
      </div>
      <div className="w-1/5 flex justify-end items-center gap-4">
        <ActionLink
          type="none"
          text="Entrar en Subasta"
          href={`/client/auctions/${auction._id}`}
        />
      </div>
    </div>
  );
};

export default AuctionClientListItem;
