import { AuctionBid } from "@/app/types/auction";
import React, { useEffect } from "react";

const TimerCounter = ({ timer, currentBid }: { timer: number, currentBid?: AuctionBid }) => {
  useEffect(() => {}, [timer, currentBid])
  return (
    <div className="flex flex-col w-20 h-20 justify-center items-center gap-4 p-20 mt-4 rounded-full relative z-20">
      <div className="flex w-20 h-20 justify-center items-center p-[4.5rem] rounded-full absolute bg-white z-20"></div>
      <span className="relative z-20 ">{timer}s</span>
      <span className="relative z-20 font-bold flex w-full min-w-max text-center">{`$ ${currentBid?.bidAmount || 0}`}</span>
      <div className="flex w-20 h-20 justify-center items-center p-20 rounded-full absolute bg-green-500 z-10"></div>
    </div>
  );
};

export default TimerCounter;
