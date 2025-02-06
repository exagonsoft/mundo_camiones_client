/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { AuctionDetail } from "@/app/types/auction";
import React, { useEffect, useState } from "react";

const AuctionTimeToStartRenderer = ({
  auction,
}: {
  auction: AuctionDetail;
}) => {
  const calculateRemainingTime = () => {
    const startDate = new Date(auction?.startDate).getTime();
    const now = new Date().getTime();
    const difference = startDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Auction has started
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 gap-4 min-h-[100px] mt-6 rounded-lg shadow-md bg-gray-400">
      <h2 className="font-bold text-lg">El Remate comienza en:</h2>
      {remainingTime.days > 0 ? (
        <p className="text-2xl font-semibold">
          {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
        </p>
      ) : (
        <p className="text-3xl font-bold">
          {remainingTime.hours}:{remainingTime.minutes}:{remainingTime.seconds}
        </p>
      )}
    </div>
  );
};

export default AuctionTimeToStartRenderer;
