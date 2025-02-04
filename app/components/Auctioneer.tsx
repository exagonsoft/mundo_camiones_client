/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import {
  AuctionBid,
  AuctionDetail,
  AuctionLot,
  StaticMedia,
  Vehicle,
  VehicleMedia,
} from "../types/auction";
import { config } from "@/lib/constants";
import { mockAuctions } from "@/mocks/mockAuctions";
import { useRouter } from "next/navigation";
import TimerCounter from "./ui/timerCounter";
import AuctioneerStreamer from "./ui/auctioneerStreamer";
import { getAuctionDetails } from "@/lib/actions";
import RenderCountry from "./ui/countryRenderer";

//#region UI Components
const LotItem = ({
  vehicle,
  currentVehicleId,
  onClick,
}: {
  vehicle: Vehicle;
  currentVehicleId?: string;
  onClick: (vehicleId: string) => void;
}) => {
  return (
    <div
      className="w-full rounded-md shadow-sm border border-slate-300 hover:shadow-lg p-4 flex gap-4 cursor-pointer relative"
      onClick={() => onClick(vehicle._id)}
    >
      <img src={vehicle.media[0].url} alt="" className="w-12 h-12 rounded-md" />
      <div className="flex flex-col">
        <span className="text-sm text-blue-700">{vehicle.title}</span>
        <span className="text-sm text-blue-700">
          precio inicial: $ {vehicle.price}
        </span>
      </div>
      {vehicle._id === currentVehicleId && (
        <div className="absolute -bottom-2 left-2 rounded-lg bg-slate-200 text-green-600 p-2 py-1 text-[.6rem]">
          en puja
        </div>
      )}
    </div>
  );
};

const LotMediaRender = ({
  vehicle,
  currentMedia,
  onMediaChange,
}: {
  vehicle?: Vehicle;
  currentMedia?: VehicleMedia;
  onMediaChange: (media: VehicleMedia) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    vehicle?.media.findIndex((media) => media.url === currentMedia?.url) || 0
  );

  const handlePrev = () => {
    if (!vehicle || !vehicle.media || vehicle.media.length === 0) return;

    const newIndex =
      (currentIndex - 1 + vehicle.media.length) % vehicle.media.length; // Loop to last media if at the first
    setCurrentIndex(newIndex);
    onMediaChange(vehicle.media[newIndex]);
  };

  const handleNext = () => {
    if (!vehicle || !vehicle.media || vehicle.media.length === 0) return;

    const newIndex = (currentIndex + 1) % vehicle.media.length; // Loop to first media if at the last
    onMediaChange(vehicle.media[newIndex]);
  };

  useEffect(() => {
    const _currentIndex =
      vehicle?.media.findIndex((media) => media.url === currentMedia?.url) || 0;
    setCurrentIndex(_currentIndex);
  }, [currentMedia, vehicle?.media]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex items-center justify-start gap-2 px-4">
        <RenderCountry country={vehicle?.country || ""} className="justify-start w-max"/>
        <span className="text-[.8rem] text-blue-800 font-bold">{`Lote #: ${vehicle?._id}`}</span>
      </div>
      <h2 className="mb-2 flex w-full justify-start px-4">{vehicle?.title}</h2>
      <div className="relative w-full h-64 rounded flex items-center justify-center gap-4">
        <div className="flex w-max p-4 justify-center items-center">
          <button
            onClick={handlePrev}
            className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10"
          >
            ◀
          </button>
        </div>

        {currentMedia ? (
          currentMedia.type === "image" ? (
            <img
              src={currentMedia.url}
              alt=""
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
          <button
            onClick={handleNext}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Media Thumbnails */}
      <div className="flex gap-2 -translate-y-2 mt-3">
        {vehicle?.media.map((media, index) => (
          <button
            key={index}
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
                alt=""
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

//#endregion

const AuctioneerView = ({ auctionId }: { auctionId?: string }) => {
  //#region Props

  const [currentMedia, setCurrentMedia] = useState<VehicleMedia | null>(null);
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const socket = useRef<Socket | null>(null);
  const [isOn, setIsOn] = useState(false);
  const auctioneerRef = useRef<{
    publishTracks: () => void;
    stopStream: () => void;
  }>(null);
  const [bidHistory, setBidHistory] = useState<AuctionBid[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [timer, setTimer] = useState<number>(0);
  const [currentBid, setCurrentBid] = useState<AuctionBid>();
  const [loadingData, setLoadingData] = useState<boolean>(true);

  //#endregion

  //#region Components Life Cycle
  useEffect(() => {
    if (session) {
      console.log("Loading Dependencies...");
      setLoadingData(true);
      loadDependencies();
    }
    if (!socket.current) {
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
        socket.current?.emit("joinAuction", { auctionId });
        if (!currentVehicle) {
          if (auction) {
            setCurrentVehicle(auction?.vehicles[0]);
            setCurrentMedia(auction?.vehicles[0].media[0]);
            broadcastLot(auction?.vehicles[0]);
          }
        } else {
          if (auction) {
            broadcastLot(currentVehicle);
          }
        }
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.current.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error.message);
      });

      socket.current?.on("timerUpdate", ({ remainingTime }) => {
        setTimer(remainingTime);
      });

      socket.current?.on(
        "bidUpdated",
        ({
          bidList,
          currentBid,
        }: {
          bidList: AuctionBid[];
          currentBid: AuctionBid;
        }) => {
          console.log("THE BIT LIST: ", bidList);

          setCurrentBid(currentBid);
          setBidHistory(bidList);
          resetTimer();
        }
      );

      // Handle client joining
      socket.current?.on("userJoined", ({ clientId }) => {
        console.log(`Client ${clientId} joined`);
        handleClientJoin();
      });
    }

    return () => {
      socket.current?.disconnect();
      socket.current?.off("answer");
      socket.current = null;
    };
  }, [auctionId, session?.user.accessToken, socket]);

  useEffect(() => {
    if (!currentVehicle) {
      if (auction) {
        setCurrentVehicle(auction?.vehicles[0]);
        setCurrentMedia(auction?.vehicles[0].media[0]);
        broadcastLot(auction?.vehicles[0]);
      }
    }
  }, [auction]);

  //#endregion

  //#region Helper Functions

  const handleClientJoin = () => {
    if (auctioneerRef.current) {
      //auctioneerRef.current.publishTracks();
    }
  };

  const startTimer = (duration: number) => {
    console.log("Starting Counter");

    socket.current?.emit("startTimer", { auctionId, duration });
  };

  const stopTimer = (duration: number) => {
    console.log("Starting Counter");

    socket.current?.emit("stopTimer", { auctionId, duration });
  };

  const resetTimer = () => {
    console.log("Resetting Timer");

    socket.current?.emit("resetTimer", { auctionId });
  };

  const broadcastMedia = (media: VehicleMedia) => {
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

  const broadcastLot = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);

    try {
      socket.current?.emit("updateLot", {
        auctionId,
        vehicle,
      });
    } catch (error) {
      console.error("Failed to broadcast media:", error);
    }
  };

  const handleLotClick = (vehicleId: string) => {
    const _currentVehicle = auction?.vehicles.find(
      (_vehicle) => _vehicle._id === vehicleId
    );
    if (_currentVehicle) {
      setCurrentVehicle(_currentVehicle);
      setCurrentMedia(_currentVehicle.media[0]);
      broadcastLot(_currentVehicle);
    }
  };

  const loadDependencies = async () => {
    try {
      const _auctionDetails = await getAuctionDetails(
        auctionId!,
        session!.user.accessToken.access_token
      );
      if(!_auctionDetails.errors){
        setAuction(_auctionDetails.data);
      }
      setLoadingData(false);
    } catch (error) {
      console.warn("Error Load Auctioneer auction dependencies");
      setLoadingData(false);
    }
  };

  //#endregion

  //#region Render Section

  return (
    <>
      {loadingData ? (
        <p>LOADING AUCTION DETAILS......</p>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <h1 className="font-bold uppercase">{auction?._id}</h1>
              {!isOn ? (
                <button
                  onClick={() => {
                    setIsOn(true);
                    startTimer(15);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Comenzar Remate
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOn(false);
                    startTimer(0);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Detener Remate
                </button>
              )}
            </div>
          </div>
          <hr className="" />
          <div className="w-full flex gap-8 justify-between items-start">
            <div className="w-1/3 flex flex-col justify-start items-center"></div>
            <div className="w-1/3 flex flex-col justify-start items-center"></div>
            <div className="w-2/3 flex flex-col justify-start items-center">
              <AuctioneerStreamer auctionId={auctionId} ref={auctioneerRef} />
            </div>
          </div>

          {/* Media Section */}
          <div className="flex justify-between items-start gap-8">
            <div className="flex flex-col items-start gap-4 w-1/3">
              <LotMediaRender
                vehicle={currentVehicle || undefined}
                currentMedia={currentMedia || undefined}
                onMediaChange={broadcastMedia}
              />
            </div>
            <div className="w-1/3 flex flex-col gap-4 relative justify-start items-center">
              <TimerCounter timer={timer} currentBid={currentBid} />
              <div className="w-full flex flex-col gap2">
                <h3 className="font-bold uppercase w-full text-center">
                  ofertas anteriores
                </h3>
                <ul className="list-disc w-full">
                  {bidHistory?.map((bid, index) => (
                    <li
                      key={index}
                      className="text-sm flex gap-2 w-full justify-center items-center"
                    >
                      <span className="">{bid.username}</span>
                      <span className="font-bold">${bid.bidAmount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-1/3 flex flex-col gap-4 ">
              <h4 className="w-full text-center font-bold uppercase">
                Listado de Lotes
              </h4>
              {auction?.vehicles.map((vehicle, indx) => (
                <LotItem
                  key={indx}
                  vehicle={vehicle}
                  currentVehicleId={currentVehicle?._id}
                  onClick={handleLotClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

//#endregion

export default AuctioneerView;
