import { AuctionBid } from "@/app/types/auction";
import React, { useEffect, useState } from "react";

const TimerCounter = ({
  timer,
  currentBid,
}: {
  timer: number;
  currentBid?: AuctionBid;
}) => {
  const [fill, setFill] = useState(100); // Start with the border fully filled.

  useEffect(() => {
    // If timer is 15 or 0, border is fully filled (100%).
    if (timer === 15 || timer === 0) {
      setFill(100);
    } else {
      // Calculate the fill percentage dynamically as the timer decreases.
      const calculatedFill = (timer / 15) * 100;
      setFill(calculatedFill);
    }
  }, [timer]);

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Circular border with dynamic fill */}
      <div
        className="absolute w-full h-full rounded-full border-[0]"
        style={{
          borderColor: "#22c55e", // Tailwind green-500
          background: `conic-gradient(
            #22c55e ${fill * 3.6}deg,
            transparent ${fill * 3.6}deg
          )`,
        }}
      ></div>

      {/* Inner content */}
      <div className="relative z-10 flex flex-col gap-4 items-center justify-center w-44 h-44 bg-white rounded-full">
        <span className="text-xl font-bold">{timer}s</span>
        <span className="text-lg font-bold">{`$${currentBid?.bidAmount || 0}`}</span>
      </div>
    </div>
  );
};

export default TimerCounter;
