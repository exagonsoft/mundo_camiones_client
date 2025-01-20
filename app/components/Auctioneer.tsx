/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import TimerController from "./ui/timmerController";
import { useSession } from "next-auth/react";
import { AuctionBid, AuctionLot, StaticMedia } from "../types/auction";
import Peer from "simple-peer";
import { config, mediaConstraints } from "@/lib/constants";
import { mockAuctions } from "@/mocks/mockAuctions";
import { useRouter } from "next/navigation";

const LotItem = ({
  lot,
  currentLotId,
  onClick,
}: {
  lot: AuctionLot;
  currentLotId?: string;
  onClick: (lotId: string) => void;
}) => {
  return (
    <div
      className="w-full rounded-md shadow-sm border border-slate-300 hover:shadow-lg p-4 flex gap-4 cursor-pointer relative"
      onClick={() => onClick(lot.id)}
    >
      <img src={lot.media[0].url} alt="" className="w-12 h-12 rounded-md" />
      <div className="flex flex-col">
        <span className="text-sm text-blue-700">{lot.title}</span>
        <span className="text-sm text-blue-700">
          precio inicial: $ {lot.startPrice}
        </span>
      </div>
      {lot.id === currentLotId && (
        <div className="absolute -bottom-2 left-2 rounded-lg bg-slate-200 text-green-600 p-2 py-1 text-[.6rem]">
          en puja
        </div>
      )}
    </div>
  );
};

const LotMediaRender = ({
  lot,
  currentMedia,
  onMediaChange,
}: {
  lot?: AuctionLot;
  currentMedia?: StaticMedia;
  onMediaChange: (media: StaticMedia) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    lot?.media.findIndex((media) => media.id === currentMedia?.id) || 0
  );

  const handlePrev = () => {
    if (!lot || !lot.media || lot.media.length === 0) return;

    const newIndex = (currentIndex - 1 + lot.media.length) % lot.media.length; // Loop to last media if at the first
    setCurrentIndex(newIndex);
    onMediaChange(lot.media[newIndex]);
  };

  const handleNext = () => {
    if (!lot || !lot.media || lot.media.length === 0) return;

    const newIndex = (currentIndex + 1) % lot.media.length; // Loop to first media if at the last
    setCurrentIndex(newIndex);
    onMediaChange(lot.media[newIndex]);
  };

  useEffect(() => {
    const _currentIndex =
      lot?.media.findIndex((media) => media.id === currentMedia?.id) || 0;
    setCurrentIndex(_currentIndex);
  }, [currentMedia?.id, lot?.media]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="">{lot?.title}</h2>
      <div className="relative w-full h-64 rounded flex items-center justify-center gap-4">
        <div className="flex w-max p-4 justify-center items-center">
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full z-10"
          >
            ◀
          </button>
        </div>

        {currentMedia ? (
          currentMedia.type === "image" ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.description}
              className="w-[85%] h-full object-cover rounded-lg"
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              className="w-[85%] h-full object-cover rounded-lg"
            ></video>
          )
        ) : (
          <p className="text-center">No media selected</p>
        )}

        <div className="flex w-max p-4 justify-center items-center">
          {" "}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full z-10"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Media Thumbnails */}
      <div className="flex gap-2 -translate-y-2">
        {lot?.media.map((media, index) => (
          <button
            key={media.id}
            onClick={() => {
              setCurrentIndex(index);
              onMediaChange(media);
            }}
            className={`w-12 h-12 border-2 rounded ${
              currentIndex === index
                ? "border-blue-500"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            {media.type === "image" ? (
              <img
                src={media.url}
                alt={media.description}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <video
                src={media.url}
                className="w-full h-full object-cover rounded"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const AuctioneerView: React.FC<{ auctionId: string }> = ({ auctionId }) => {
  const [currentMedia, setCurrentMedia] = useState<StaticMedia | null>(null);
  const auction = mockAuctions.find((_auction) => _auction.id === auctionId);
  const [currentLot, setCurrentLot] = useState<AuctionLot | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<Socket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const peerRef = useRef<Peer.Instance | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [timer, setTimer] = useState<number>(0);
  const [showMirror, setShowMirror] = useState<boolean>(false);
  const [bidHistory, setBidHistory] = useState<AuctionBid[]>([]);
  const [currentBid, setCurrentBid] = useState<AuctionBid>();

  useEffect(() => {
    if (!socket.current) {
      // Initialize WebSocket connection
      socket.current = io(config.baseAuctionUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: {
          token: `Bearer ${session?.user.accessToken}`, // Send the token
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to WebSocket server:", socket.current?.id);
        socket.current?.emit("joinAuction", { auctionId });
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.current.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error.message);
      });

      socket.current?.on("answer", ({ signalData }) => {
        console.log("Received answer:", signalData);
        peerRef.current?.signal(signalData);
      });

      socket.current?.on("timerUpdate", ({ remainingTime }) => {
        setTimer(remainingTime);
      });

      socket.current?.on("bidUpdated", ({bidList, currentBid}:{bidList: AuctionBid[], currentBid: AuctionBid}) => {
         setCurrentBid(currentBid);
         setBidHistory((prevList) => ({...prevList, ...bidList}))
      })
    }

    return () => {
      socket.current?.disconnect();
      socket.current?.off("answer");
      socket.current = null;
    };
  }, [auctionId, session?.user.accessToken, isStreaming, socket]);

  const startStream = async () => {
    try {
      console.log("Starting stream...");

      // Get new media stream
      const _mediaStream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints
      );
      console.log("Obtained new media stream:", _mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = _mediaStream;
        videoRef.current.muted = true; // Mute for autoplay
        await videoRef.current.play();
        setShowMirror(true);
      }

      // Create a new peer connection
      if (!peerRef.current) {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: _mediaStream,
        });

        // Handle signaling
        peer.on("signal", (data) => {
          console.log("Sending offer:", data);
          socket.current?.emit("offer", { auctionId, signalData: data });
        });

        // Handle errors
        peer.on("error", (error) => {
          console.error("Peer error:", error);
        });

        // Save the peer instance
        peerRef.current = peer;
      } else {
        // Clean up old peer connection if it exists
        if (peerRef.current) {
          console.log("Destroying old peer before creating a new one...");
          peerRef.current.destroy();
          peerRef.current = null;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: _mediaStream,
        });

        // Handle signaling
        peer.on("signal", (data) => {
          console.log("Sending offer:", data);
          socket.current?.emit("offer", { auctionId, signalData: data });
        });

        // Handle errors
        peer.on("error", (error) => {
          console.error("Peer error:", error);
        });

        // Save the peer instance
        peerRef.current = peer;
      }
      if(currentMedia){
        broadcastMedia(currentMedia);
      }
      setIsStreaming(true);
    } catch (error) {
      console.error("Failed to start stream:", error);
    }
  };

  const stopStream = () => {
    try {
      console.log("Stopping stream...");

      // Stop media tracks
      const mediaStream = videoRef.current?.srcObject as MediaStream;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind}, ID: ${track.id}`);
          track.stop();
        });
      }

      // Reset the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.pause();
      }

      // Notify the server
      socket.current?.emit("stopStream", { auctionId });

      // Reset state
      setIsStreaming(false);

      console.log("Stream stopped successfully and resources released");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };

  const toggleMirror = () => {
    setShowMirror((prevValue) => !prevValue);
  };

  const startTimer = (duration: number) => {
    console.log("Starting Counter");
    
    socket.current?.emit("startTimer", { auctionId, duration });
  };

  const resetTimer = () => {
    console.log("Resetting Timer");
    
    socket.current?.emit("resetTimer", { auctionId });
  };

  const broadcastMedia = (media: StaticMedia) => {
    setCurrentMedia(media);

    try {
      socket.current?.emit("updateMedia", {
        auctionId,
        media,
      });
    } catch (error) {
      console.error("Failed to broadcast media:", error);
    }
  };

  const handleLotClick = (lotId: string) => {
    console.log(`Lot ${lotId} clicked`);
    const _currentLot = auction?.lots.find((_lot) => _lot.id === lotId);
    if (_currentLot) {
      setCurrentLot(_currentLot);
      setCurrentMedia(_currentLot.media[0]);
      broadcastMedia(_currentLot.media[0]);
    }
  };

  useEffect(() => {
    if (!currentLot) {
      if (auction) {
        setCurrentLot(auction?.lots[0]);
        setCurrentMedia(auction?.lots[0].media[0]);
      }
    }
  }, [auction, currentLot, currentMedia]);

  useEffect(() => {}, [showMirror]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="">
          <h1 className="">{auction?.id}</h1>
          {!isStreaming ? (
            <button
              onClick={startStream}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Comenzar Remate
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Detener Remate
            </button>
          )}
        </div>
        <div className="flex w-full justify-end items-start gap-4">
          {!showMirror ? (
            <>
              <button
                onClick={toggleMirror}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Mostrar Espejo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleMirror}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Ocultar Espejo
              </button>
            </>
          )}
          <video
            ref={videoRef}
            autoPlay
            aria-disabled={!showMirror}
            className={`w-64 h-48 border rounded ${!showMirror && "hidden"}`}
          />
          {!showMirror && <div className={`w-64 h-48 border rounded`}></div>}
        </div>
      </div>
      <hr className="" />

      {/* Media Section */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col items-start gap-4 w-[40%]">
          <LotMediaRender
            lot={currentLot || undefined}
            currentMedia={currentMedia || undefined}
            onMediaChange={broadcastMedia}
          />
        </div>
        <div className="w-[25%]">
          <TimerController
            startTimer={startTimer}
            resetTimer={resetTimer}
            timer={timer}
            currentBid={currentBid}
          />
        </div>
        <div className="w-[35%] flex flex-col gap-4">
          <h4 className="">Listado de Lotes</h4>
          {auction?.lots.map((lot, indx) => (
            <LotItem
              key={indx}
              lot={lot}
              currentLotId={currentLot?.id}
              onClick={handleLotClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctioneerView;
