"use client";
import { AuctionDetail } from "@/app/types/auction";
import Image from "next/image";
import React, { useEffect } from "react";

const AuctionMediaInfo = ({ auction }: { auction: AuctionDetail }) => {
  useEffect(() => {}, [auction]);
  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <span className="-mb-2 px-4 w-full text-left flex items-center justify-start text-[.6rem]">{`Lote #: ${auction?.vehicles[0]._id} ${auction?.vehicles[0].title}`}</span>
      <div className="w-full relative justify-center items-center">
        <Image
          src={auction?.vehicles[0].media[0].url || "/"}
          alt=""
          width={300}
          height={200}
          className="object-cover w-full h-[200px] rounded-lg"
        />
        <div className="absolute flex w-full h-full justify-start items-center top-0 left-0 pl-6 bg-gradient-to-r from-black/80 to-transparent rounded-lg">
          <h2 className="text-xl capitalize font-bold text-white text-wrap max-w-[60%]">
            Espere un Momento, el remate comenzara pronto...
          </h2>
        </div>
      </div>
      <div className="w-full relative justify-center items-center">
        <Image
          src={auction?.vehicles[1].media[0].url || "/"}
          alt=""
          width={300}
          height={300}
          className="object-cover w-full h-[200px] rounded-lg"
        />
        <div className="absolute flex w-full h-full justify-end items-center top-0 left-0 pr-6 bg-gradient-to-l from-black/80 to-transparent rounded-lg">
          <h2 className="text-xl capitalize font-bold text-white ">
            Proximo Lote
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuctionMediaInfo;
