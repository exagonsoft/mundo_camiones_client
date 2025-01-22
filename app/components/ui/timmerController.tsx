"use client";
import React, { useState } from "react";
import TimerCounter from "./timerCounter";
import { AuctionBid } from "@/app/types/auction";

const TimerController: React.FC<{
  startTimer: (duration: number) => void;
  resetTimer: () => void;
  timer: number;
  currentBid?: AuctionBid;
}> = ({ startTimer, resetTimer, timer, currentBid }) => {
  const [duration, setDuration] = useState<number>(15);

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <div className="relative w-full flex h-[160px] justify-center items-center">
        <TimerCounter timer={timer} currentBid={currentBid}/>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border p-2 rounded w-full"
          placeholder="Duration (seconds)"
        />
        <button
          onClick={() => startTimer(duration)}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Start Timer
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Reset Timer
        </button>
      </div>
    </div>
  );
};

export default TimerController;
