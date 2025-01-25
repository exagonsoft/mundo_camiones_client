/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, RemoteTrackPublication } from "livekit-client";
import { config } from "@/lib/constants";

const ClientStreamer = ({
  auctionId,
  clientId,
}: {
  auctionId?: string;
  clientId?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const roomRef = useRef<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchToken = async (
    identity: string,
    room: string,
    canPublish: boolean,
    canSubscribe: boolean
  ) => {
    const response = await fetch("/api/generate_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, room, canPublish, canSubscribe }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    return data.token;
  };

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        console.log("Attempting to connect to the room...");

        // Replace with the correct token for the client
        const clientToken = await fetchToken(
          clientId!,
          auctionId!,
          false,
          true
        );
        console.log("CLIENT TOKEN: ", clientToken);

        // Create and configure the LiveKit Room
        const room = new Room();

        // Retry logic in case the room is not yet available
        let retries = 5; // Number of attempts
        while (retries > 0) {
          try {
            await room.connect(config.streamingUrl, clientToken, {
              autoSubscribe: true,
            });
            console.log("Connected to room:", room.name);
            setIsConnected(true);
            break;
          } catch (error) {
            if (retries === 1) throw error;
            console.warn("Room not ready, retrying...");
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
          }
          retries -= 1;
        }

        roomRef.current = room;

        // Subscribe to media tracks
        room.on(
          RoomEvent.TrackSubscribed,
          (track, publication: RemoteTrackPublication) => {
            console.log("Track subscribed:", track);

            if (track.kind === Track.Kind.Video && videoRef.current) {
              track.attach(videoRef.current);
              videoRef.current.play();
              console.log("Remote video attached.");
            }

            if (track.kind === Track.Kind.Audio) {
              track.attach(); // Audio is played automatically
              console.log("Remote audio attached.");
            }
          }
        );

        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          console.log("Track unsubscribed:", track);
          track.detach();
        });

        // Handle room disconnection
        room.on(RoomEvent.Disconnected, () => {
          console.log("Disconnected from room.");
          roomRef.current = null;
          setIsConnected(false);
        });

        setIsConnecting(false);
      } catch (error) {
        console.error("Failed to connect to the room:", error);
        setIsConnecting(false);
      }
    };
    console.log("THE CLIENT PARAMETERS: ", { auctionId, clientId });

    if (auctionId && clientId) {
      connectToRoom();
    }

    // Cleanup on component unmount
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, [auctionId, clientId]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-52">
      {isConnecting ? (
        <p>Connecting to the auction...</p>
      ) : isConnected ? (
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto border rounded"
        />
      ) : (
        <p className="text-wrap">
          Failed to connect to the auction. Please try again later.
        </p>
      )}
    </div>
  );
};

export default ClientStreamer;
