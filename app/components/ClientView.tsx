/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import TimerCounter from "./ui/timerCounter";
import { AuctionBid, AuctionLot, StaticMedia } from "../types/auction";
import MediaComponent from "./ui/mediaComponent";
import { config } from "@/lib/constants";
import { useRouter } from "next/navigation";
import ClientStreamer from "./ui/clientStreamer";

const ClientView = ({ auctionIdentifier }: { auctionIdentifier?: string }) => {
  //#region Props
  const [currentBid, setCurrentBid] = useState<AuctionBid>({
    auctionId: auctionIdentifier!,
    username: "",
    bidAmount: 0,
  });
  const [bidHistory, setBidHistory] = useState<AuctionBid[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [productMedia, setProductMedia] = useState<StaticMedia | null>(null);
  const [currentLot, setCurrentLot] = useState<AuctionLot | null>(null);
  const socket = useRef<Socket | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  //#endregion

  //#region Components Life Cycle

  useEffect(() => {
    if (!session?.user.accessToken) {
      console.warn("Session or access token not available yet.");
      return;
    } else {
      // Initialize WebSocket connection
      socket.current = io(config.baseAuctionUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: {
          token: `Bearer ${session?.user.accessToken?.access_token}`, // Send the token
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to WebSocket server:", socket.current?.id);
        socket.current?.emit("joinAuction", { auctionId: auctionIdentifier });
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      // Listen for the 'initialData' event from the server
      socket.current.on("auctionJoined", ({ auctionId, clientId }) => {
        console.log(
          `User ${clientId} has joined auction ${auctionId}`,
          clientId
        );
        if (auctionId === auctionIdentifier) {
          console.log("SEND REQUEST INITIAL DATA EVENT");

          socket.current?.emit("requestInitialData", { auctionId });
        }
      });

      socket.current?.on("timerUpdate", ({ remainingTime }) => {
        setTimer(remainingTime);
      });

      // Listen for the 'initialData' event from the server
      socket.current.on("initialData", (data) => {
        console.log("Received initial data:", data);
        setCurrentBid(data.currentBid);
        setBidHistory(data.bidHistory);
        setProductMedia(data.currentMedia);
        setCurrentLot(data.lot.lot);
      });

      // Listen for auction updates
      socket.current?.on("bidUpdated", handleBitUpdate);

      socket.current.on("mediaUpdated", (media) => {
        const _url = media.media.url;
        const _type = media.media.type;

        setProductMedia({
          url: _url,
          type: _type,
          description: media?.description,
          id: media?.id,
        });
      });

      socket.current.on("userLeft", ({ auctionId }) => {
        console.log("Stream has been stopped by the auctioneer.");
        if (auctionId === auctionIdentifier) {
          console.log("SEND REQUEST INITIAL DATA EVENT");

          socket.current?.emit("requestInitialData", { auctionId });
        }
      });

      socket.current.on("auctionStopped", () => {
        console.log("Stream has been stopped by the auctioneer.");
        router.push("/dashboard");
      });

      socket.current.on("lotUpdated", ({ lot }) => {
        console.log("Auction Lot Has Changed");
        setCurrentLot(lot);
        setProductMedia(lot.media[0]);
      });
    }

    return () => {
      socket.current?.off("bidUpdated", handleBitUpdate);
      socket.current?.disconnect();
    };
  }, [auctionIdentifier, session?.user.accessToken?.access_token]);

  useEffect(() => {}, [productMedia?.url, currentLot, socket]);

  //#endregion

  //#region Helper Functions

  const handleBitUpdate = (data: { currentBid?: any; bidList?: any }) => {
    console.log("Received bidUpdated event:", data);

    if (!data || typeof data !== "object") {
      console.error("Invalid bidUpdated payload:", data);
      return;
    }

    const { currentBid, bidList } = data;

    if (!currentBid || !bidList) {
      console.error("Incomplete bidUpdated data:", data);
      return;
    }

    setCurrentBid(currentBid);
    setBidHistory(bidList);
  };

  

  const handlePlaceBid = (amount: number) => {
    if (socket.current) {
      const newBid = {
        auctionId: auctionIdentifier,
        bidAmount: amount,
        username: session?.user?.id,
      };

      socket.current.emit("placeBid", {
        bid: newBid,
        auctionId: auctionIdentifier,
      });
    }
  };

  //#endregion

  //#region Render Section

  return (
    <section className="flex flex-col gap-12 justify-start items-center relative z-0">
      <div className="w-full relative flex justify-between items-center">
        <div className="flex justify-start gap-4 items-center relative">
          <img
            src="/media/subastas_icon.jpg"
            alt="Subastas"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-bold">{`Subasta ${auctionIdentifier}`}</span>
            <span className="text-sm text-gray-500">{`Lote: N ${currentLot?.id}`}</span>
          </div>
          <div className="absolute -bottom-10 px-2 left-0 w-max">
            <span className="w-full text-sm">{currentLot?.title}</span>
          </div>
        </div>
        <div className="">
          <div
            className={`rounded-xl p-4 py-1 ${
              currentLot?.id ? "bg-green-700" : "bg-gray-500"
            } relative flex justify-center gap-2 items-center`}
          >
            <div
              className={`rounded-full p-1 border ${
                currentLot?.id
                  ? "bg-green-400 shadow-green-200"
                  : "bg-transparent"
              } `}
            ></div>
            <span className={`text-[.6rem] p-0 flex uppercase ${currentLot?.id && 'text-green-400'}`}>{currentLot?.id ? 'En vivo' : 'en espera'}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col relative min-h-52">
        <div className=""></div>
        <div className="w-full flex gap-4 justify-between">
          {/* Product Media */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <MediaComponent productMedia={productMedia!} />
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center gap-4 w-1/4 justify-center relative">
            <div className="flex-col w-full gap-1 text-sm border flex justify-center items-center rounded-md relative">
              <span className="!text-sm">
                precio base $ {currentLot?.startPrice}
              </span>
              <span className="!text-sm">
                incremento $ {currentLot?.increment}
              </span>
            </div>
            <div className="font-bold h-full w-full flex justify-center items-center relative mt-4">
              <TimerCounter timer={timer} currentBid={currentBid} />
            </div>
          </div>

          {/* Auctioneer Stream */}
          <ClientStreamer auctionId={auctionIdentifier} clientId={socket.current?.id}/>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-between relative">
        <div className="w-1/4"></div>
        <div className="w-1/3">
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = parseFloat(
                    (e.target as HTMLFormElement).bidAmount.value
                  );
                  if (amount > currentBid!.bidAmount) {
                    handlePlaceBid(amount);
                  } else {
                    alert("Your bid must be higher than the current bid.");
                  }
                }}
                className="flex items-center gap-2 w-full"
              >
                <div className="w-full flex relative justify-between items-center gap-4">
                  <input
                    type="number"
                    name="bidAmount"
                    placeholder="Enter your bid"
                    className="border p-2 rounded"
                  />
                  <span className="absolute right-28 text-2xl">+</span>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-max uppercase"
                  >
                    Pujar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex flex-col items-center gap-2 justify-center">
            <h3 className="font-bold uppercase">ofertas anteriores</h3>
            <ul className="list-disc">
              {bidHistory.map((bid, index) => (
                <li key={index} className="text-sm flex gap-2">
                  <span className="">{bid.username}</span>
                  <span className="font-bold">${bid.bidAmount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

//#endregion

export default ClientView;
