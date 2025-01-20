import { AuctionBid } from "@/app/types/auction";
import React from "react";

const TimerCounter = ({ timer, currentBid }: { timer: number, currentBid?: AuctionBid }) => {
  return (
    <div className="flex w-20 h-20 justify-center items-center p-20 rounded-full absolute z-20">
      <div className="flex w-20 h-20 justify-center items-center p-16 rounded-full absolute bg-white z-20">{timer}s</div>
      {currentBid?.bidAmount}
      <div className="flex w-20 h-20 justify-center items-center p-20 rounded-full absolute bg-green-500 z-10"></div>
    </div>
  );
};

export default TimerCounter;
