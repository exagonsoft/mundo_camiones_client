/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Room,
  RoomEvent,
  VideoPresets,
  createLocalTracks,
} from "livekit-client";


import "@livekit/components-styles";
import { config } from "@/lib/constants";

// Props for AuctioneerStreamer
interface AuctioneerStreamerProps {
  auctionId?: string;
}



// ForwardRef Component
const AuctioneerStreamer = forwardRef(
  ({ auctionId }: AuctioneerStreamerProps, ref) => {
    const [showMirror, setShowMirror] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const roomRef = useRef<Room | null>(null);
    const tracksRef = useRef<any[]>([]); // Store tracks for reuse
    const [token, setToken] = useState<string>("");

    useEffect(() => {
      if(auctionId){
        getStreamToken();
      }
      return () => {
        if (roomRef.current) {
          roomRef.current.disconnect();
        }
      };
    }, [auctionId]);

    const getStreamToken = async () => {
      const auctioneerToken = await fetchToken(
        "auctioneer-123",
        auctionId!,
        true,
        false
      );

      setToken(auctioneerToken);
      console.log("AUCTIONEER TOKEN: ", auctioneerToken);
    };

    const startStream = async () => {
      try {
        console.log("Starting stream... room: ", auctionId);

        // Replace with the correct token for the auctioneer

        // Create and configure the LiveKit Room
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
        });

        // Connect to the LiveKit server
        await room.connect(config.streamingUrl, token, {
          autoSubscribe: true,
        });
        console.log("Connected to room:", room.name);

        roomRef.current = room;

        // Capture video and audio tracks
        const tracks = await createLocalTracks({ video: true, audio: true });
        tracksRef.current = tracks; // Save tracks for reuse

        // Publish tracks to the room
        await publishTracks();

        // Attach the local video track
        const videoTrack = tracks.find((track) => track.kind === "video");
        if (videoTrack && videoRef.current) {
          videoTrack.attach(videoRef.current);
        }

        const audioTrack = tracks.find((track) => track.kind === "audio");
        if (audioTrack && videoRef.current) {
          audioTrack.attach(videoRef.current);
          console.log("Local video and audio attached.");
        }
        videoRef?.current?.play();

        setIsStreaming(true);

        // Detect when new participants join
        room.on(RoomEvent.ParticipantConnected, async (participant) => {
          console.log("New participant joined:", participant.identity);

          const publishedTrackIds = room.localParticipant
            .getTrackPublications()
            .map((publication) => publication.trackSid);

          for (const track of tracksRef.current) {
            const isPublished = publishedTrackIds.includes(track.sid);
            if (!isPublished) {
              await room.localParticipant.publishTrack(track);
              console.log(
                `Re-published track for participant ${participant.identity}.`
              );
            }
          }
        });

        // Handle room disconnection
        room.on(RoomEvent.Disconnected, () => {
          console.log("Disconnected from room.");
          roomRef.current = null;
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          setIsStreaming(false);
        });
      } catch (error) {
        console.error("Failed to start stream:", error);
      }
    };

    const publishTracks = async () => {
      try {
        if (!roomRef.current || !tracksRef.current.length) {
          console.warn("No room or tracks available to publish.");
          return;
        }

        for (const track of tracksRef.current) {
          await roomRef.current.localParticipant.publishTrack(track);
        }
        console.log("Published video and audio tracks.");
      } catch (error) {
        console.error("Failed to publish tracks:", error);
      }
    };

    const stopStream = () => {
      try {
        console.log("Stopping stream...");

        // Detach the video element
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.pause();
        }

        // Disconnect and clean up the LiveKit room
        if (roomRef.current) {
          roomRef.current.localParticipant
            .getTrackPublications()
            .forEach((publication) => {
              const track = publication.track;
              if (track) {
                track.stop(); // Stops the underlying MediaStreamTrack
                track.detach(); // Detaches from any attached HTML elements
              }
            });

          // Disconnect from the room
          roomRef.current.disconnect();
          console.log("Disconnected from the LiveKit room.");
          roomRef.current = null;
        }

        // Update state
        setIsStreaming(false);

        console.log("Stream stopped successfully and resources released.");
      } catch (error) {
        console.error("Error stopping stream:", error);
      }
    };

    const toggleMirror = () => {
      setShowMirror((prevValue) => !prevValue);
    };

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

    // Expose functions via the forwarded ref
    useImperativeHandle(ref, () => ({
      publishTracks,
      stopStream,
    }));

    return (
      <div className="flex w-full justify-end items-start gap-4">
        <div className="w-1/3 flex flex-col gap-4">
          {!isStreaming ? (
            <button
              onClick={startStream}
              disabled={auctionId === null || undefined}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full"
            >
              Comenzar Transmisión
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm w-full"
            >
              Terminar Transmisión
            </button>
          )}
          {!showMirror ? (
            <button
              onClick={toggleMirror}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full"
            >
              Mostrar Espejo
            </button>
          ) : (
            <button
              onClick={toggleMirror}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm w-full"
            >
              Ocultar Espejo
            </button>
          )}
        </div>
        <div className={`w-2/3 h-56 border rounded ${!showMirror && "hidden"}`}>
          <video
            ref={videoRef}
            autoPlay
            aria-disabled={!showMirror}
            className={`w-full h-full max-h-56 object-cover border rounded ${
              !showMirror && "hidden"
            }`}
          />
        </div>

        {!showMirror && <div className={`w-2/3 h-56 border rounded`}></div>}
      </div>
    );
  }
);

export default AuctioneerStreamer;
