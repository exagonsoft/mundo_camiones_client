import { AuctionDetail } from "@/app/types/auction";
import Image from "next/image";
import React from "react";
import RenderCountry from "../ui/countryRenderer";
import AuctionTimeToStartRenderer from "../ui/auctionTimeToStartRenderer";
import ActionButton from "../actionButton";
import ActionLink from "../ui/actionLink";

const ClientAuctionDashboardItem = ({
  auction,
}: {
  auction: AuctionDetail;
}) => {
  return (
    <div className="w-full rounded-lg shadow-md p-4 flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <Image
            src="/media/subastas_icon.jpg"
            width={30}
            height={30}
            alt=""
            className="rounded-full"
          />
          <span className="font-bold">{auction._id}</span>
        </div>
        <div className="">
          <Image
            src="/auctioneer_icon.png"
            width={90}
            height={40}
            alt=""
            className="w-[90px] h-[40px] rounded-lg"
          />
        </div>
      </div>
      <span className="px-4">Lotes del remate/subastas</span>
      {auction.vehicles.map((_vehicle, indx) => (
        <div
          key={indx}
          className="w-full flex justify-center gap-2 rounded-lg shadow-md p-2 relative"
        >
          <div className="w-[90%] flex items-center justify-start gap-4">
            <Image
              src={_vehicle.media[0].url}
              alt=""
              width={60}
              height={36}
              className="rounded-md"
            />
            <div className="w-[75%] flex flex-col gap-1 font-bold">
              <span className="flex items-center justify-start text-[.6rem]">{`Lote No ${_vehicle._id} ${_vehicle.title}`}</span>
              <span className="text-[.6rem]">{`Minimo $${_vehicle.price}`}</span>
            </div>
          </div>
          <div className="w-[10%] flex justify-center items-center h-full">
            <RenderCountry
              country={_vehicle.country}
              className=""
              showName={false}
            />
          </div>
        </div>
      ))}
      <AuctionTimeToStartRenderer auction={auction}/>
      <div className="w-full justify-between items-center flex gap-4">
        <ActionButton text="PAGAR GARANTIA" className="font-bold w-full"/>
        <ActionLink href="/client/auctions" text="IR A LAS SUBASTAS" className="bg-blue-700 font-bold w-full"/>
      </div>
    </div>
  );
};

export default ClientAuctionDashboardItem;
