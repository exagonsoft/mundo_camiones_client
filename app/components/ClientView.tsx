/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import TimerCounter from "./ui/timerCounter";
import { AuctionBid, StaticMedia } from "../types/auction";
import MediaComponent from "./ui/mediaComponent";
import Peer from "simple-peer";
import { useRouter } from "next/navigation";
import { config } from "@/lib/constants";

const ClientView = ({ auctionIdentifier }: { auctionIdentifier?: string }) => {
  const [currentBid, setCurrentBid] = useState<AuctionBid>({
    auctionId: auctionIdentifier!,
    username: "",
    bidAmount: 0,
  });
  const [bidHistory, setBidHistory] = useState<AuctionBid[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [productMedia, setProductMedia] = useState<StaticMedia | null>(null);
  const socket = useRef<Socket | null>(null);
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const router = useRouter();

  const handleOffer = ({
    auctionId,
    clientId,
    signalData,
  }: {
    auctionId: string;
    clientId: string;
    signalData: any;
  }) => {
    console.log(
      `Received offer from auctioneer for client ${clientId} (current socket client ID: ${socket.current?.id}):`,
      signalData
    );
  
    // Check if it's an offer
    if (signalData.type === "offer") {
      // Create a new Peer instance if none exists
      if (!peerRef.current) {
        peerRef.current = new Peer({ initiator: false, trickle: true });
  
        // Handle signaling
        peerRef.current.on("signal", (data) => {
          console.log("Sending answer:", data);
          socket.current?.emit("answer", {
            auctionId,
            clientId: clientId, // Include the client's socket ID
            signalData: data,
          });
        });
  
        // Handle incoming media stream
        peerRef.current.on("stream", (stream) => {
          console.log("Received stream from auctioneer:", stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current
              .play()
              .catch((err) => console.error("Playback failed:", err));
          }
        });
  
        // Handle peer errors
        peerRef.current.on("error", (err) => {
          console.error("Peer error:", err);
        });
      }
  
      // Signal the offer to the peer
      console.log("Processing offer:", signalData);
      peerRef.current.signal(signalData);
    } else if (signalData.type === "candidate") {
      // Handle ICE candidates
      console.log("Received ICE candidate:", signalData.candidate);
      peerRef.current?.signal(signalData);
    }
  };
  

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

    console.log("BIT UPDATED DATA:", { currentBid, bidList });

    setCurrentBid(currentBid);
    setBidHistory((prev) => [...prev, ...bidList]);
  };

  useEffect(() => {
    if (!session?.user.accessToken) {
      console.warn("Session or access token not available yet.");
      return;
    } else {
      console.log("THE ACCESS TOKEN: ", session?.user.accessToken);

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
        setProductMedia({
          type: data.currentMedia.type,
          url: data.currentMedia.url,
          id: data.currentMedia.id,
          description: data.description,
        });
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

      socket.current.on("streamStopped", () => {
        console.log("Stream has been stopped by the auctioneer.");
        cleanupStream();
        router.push("/dashboard");
      });

      socket.current?.on("offer", handleOffer);
    }

    return () => {
      cleanupStream();
      socket.current?.off("offer", handleOffer);
      socket.current?.off("bidUpdated", handleBitUpdate);
      socket.current?.disconnect();
    };
  }, [auctionIdentifier, session?.user.accessToken?.access_token]);

  const cleanupStream = () => {
    console.log("Cleaning up stream and peer connection...");

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
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

  useEffect(() => {}, [productMedia?.url]);

  return (
    <section className="flex flex-col gap-16 justify-start items-center relative z-0">
      <div className="w-full flex flex-col">
        <div className=""></div>
        <div className="w-full flex gap-4 justify-between">
          {/* Product Media */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <MediaComponent productMedia={productMedia!} />
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center gap-4 w-1/4 justify-center relative">
            <div className="flex-col w-full gap-1 text-sm border flex justify-center items-center rounded-md relative">
              <span className="!text-sm">precio base $ 10,000.00</span>
              <span className="!text-sm">incremento $ 50.000</span>
            </div>
            <div className="font-bold h-full w-full flex justify-center items-center relative mt-4">
              <TimerCounter timer={timer} currentBid={currentBid} />
            </div>
          </div>

          {/* Auctioneer Stream */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <video
              ref={videoRef}
              id="auctioneer-video"
              className="h-48 object-cover border border-black rounded-lg"
              autoPlay
              muted
              playsInline
            ></video>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-between">
        <div className="w-1/4"></div>
        <div className="w-1/3">
          <div className="w-full flex flex-col justify-center items-center gap-4">
            {/* Current Bid */}
            <div className="flex justify-center items-center gap-2 rounded border w-full">
              <h3 className="text-sm">Current Bid</h3>
              <div className="text-xl font-bold">${currentBid?.bidAmount}</div>
            </div>

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
                <input
                  type="number"
                  name="bidAmount"
                  placeholder="Enter your bid"
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded w-max"
                >
                  Place Bid
                </button>
              </form>
              <div className="flex flex-col items-center gap-2 justify-center">
                <h3>Previous Bids</h3>
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
        </div>
        <div className="w-1/4"></div>
      </div>
    </section>
  );
};

export default ClientView;
