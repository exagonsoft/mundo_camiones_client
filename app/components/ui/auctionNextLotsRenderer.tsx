"use client";
import { AuctionDetail } from "@/app/types/auction";
import Image from "next/image";
import React, { useEffect } from "react";
import RenderCountry from "./countryRenderer";

const AuctionNextLotsRenderer = ({ auction }: { auction: AuctionDetail }) => {
  useEffect(() => {}, [auction]);

  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <span className="-mb-2 px-4 w-full text-left flex items-center justify-start text-[.7rem] font-bold">
        Lotes del Remate
      </span>
      {auction?.vehicles.slice(1).map((vehicle, indx) => (
        <div
          key={indx}
          className="w-full flex justify-center gap-2 rounded-lg shadow-md p-2 relative"
        >
          {indx === 0 && (
            <div className="font-bold text-[.6rem] absolute left-2 -bottom-1 p-2 py-0 bg-white rounded-lg">
              Proximo
            </div>
          )}
          <div className="w-[15%]">
            <Image
              src={vehicle.media[0].url}
              alt=""
              width={60}
              height={36}
              className="rounded-md"
            />
          </div>
          <div className="w-[75%] flex flex-col gap-1">
            <span className="flex items-center justify-start text-[.6rem]">{`Lote No ${vehicle._id} ${vehicle.title}`}</span>
            <span className="text-[.6rem]">{`Minimo $${vehicle.price}`}</span>
          </div>
          <div className="w-[10%] flex justify-center items-center h-full"><RenderCountry country={vehicle.country} className="" showName={false}/></div>
        </div>
      ))}
    </div>
  );
};

export default AuctionNextLotsRenderer;
