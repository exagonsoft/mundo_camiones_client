/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const handleOffer = ({ signalData }: { signalData: any }) => {
    console.log("Received offer:", signalData);

    // If a previous peer exists, destroy it
    if (peerRef.current) {
      console.log("Destroying old peer before creating a new one...");
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Create a new Peer instance for the new connection
    const peer = new Peer({
      initiator: false, // Client is not the initiator
      trickle: false,
    });

    peer.on("signal", (data) => {
      console.log("Sending answer:", data);
      socket.current?.emit("answer", {
        auctionId: auctionIdentifier,
        signalData: data,
      });
    });

    peer.on("stream", (stream) => {
      console.log("Received new stream:", stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = false;

        videoRef.current
          .play()
          .then(() => {
            console.log("🎥 Playback started successfully");
          })
          .catch((error) => {
            return;
          });
      }
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
    });

    peer.on("error", (error) => {
    });

    // Signal the received offer to the new peer
    peer.signal(signalData);

    // Store the peer instance
    peerRef.current = peer;
  };

  const handleBitUpdate = ({ data }: { data: any }) => {
    console.log("BIT UPDATED DATA: ", data);

    setCurrentBid(data.currentBid);
    setBidHistory((prev) => [...prev, ...data.bidList]);
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
      socket.current.on("auctionJoined", ({ auctionId, username }) => {
        console.log(
          `User ${username} has joined auction ${auctionId}`,
          username
        );
        if (auctionId === auctionIdentifier) {
          console.log("SEND REQUEST INITIAL DATA EVENT");

          socket.current?.emit("requestInitialData", { auctionId });
        }
      });

      // Listen for the 'initialData' event from the server
      socket.current.on("initialData", (data) => {
        console.log("Received initial data:", data);
        if (data.client === session?.user?.id) {
          setCurrentBid(data.currentBid);
          setBidHistory(data.bidHistory);
          setProductMedia({
            type: data.currentMedia.type,
            url: data.currentMedia.url,
            id: data.currentMedia.id,
            description: data.description,
          });
        }
      });

      // Listen for auction updates
      socket.current.on("bidUpdated", handleBitUpdate);

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
      socket.current?.disconnect();
    };
  }, [auctionIdentifier, session?.user.accessToken?.access_token]);

  const cleanupStream = () => {
    console.log("Cleaning up stream and peer connection...");

    // if (peerRef.current) {
    //   console.log("Peer connection closed");
    //   peerRef.current.destroy();
    //   peerRef.current = null;
    // }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
      console.log("🎥🎥🎥🎥🎥🎥Video stream cleared🎥🎥🎥🎥🎥🎥");
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
              <TimerCounter timer={timer} />
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
