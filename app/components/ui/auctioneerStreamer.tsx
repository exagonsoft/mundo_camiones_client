/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { generateToken } from "@/lib/ssTokenGenerator";

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

    useEffect(() => {
      return () => {
        if (roomRef.current) {
          roomRef.current.disconnect();
        }
      };
    }, [auctionId]);

    const startStream = async () => {
      try {
        console.log("Starting stream... room: ", auctionId);

        // Replace with the correct token for the auctioneer
        const auctioneerToken = await generateToken('auctioneer-123', auctionId!, true, false);
        console.log("AUCTIONEER TOKEN: ", auctioneerToken);
        
        // Create and configure the LiveKit Room
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
        });

        // Connect to the LiveKit server
        await room.connect("ws://44.211.72.87:7880", auctioneerToken);
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
          videoRef.current.play();
          console.log("Local video attached.");
        }

        setIsStreaming(true);

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

    // Expose functions via the forwarded ref
    useImperativeHandle(ref, () => ({
      publishTracks,
      stopStream,
    }));

    return (
      <div className="flex w-full justify-end items-start gap-4">
        <div className="w-max flex flex-col gap-4">
          {!isStreaming ? (
            <button
              onClick={startStream}
              disabled={auctionId === null || undefined}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Comenzar Transmisión
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Terminar Transmisión
            </button>
          )}
          {!showMirror ? (
            <button
              onClick={toggleMirror}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Mostrar Espejo
            </button>
          ) : (
            <button
              onClick={toggleMirror}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Ocultar Espejo
            </button>
          )}
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          aria-disabled={!showMirror}
          className={`w-64 h-48 border rounded ${!showMirror && "hidden"}`}
        />
        {!showMirror && <div className={`w-64 h-48 border rounded`}></div>}
      </div>
    );
  }
);

export default AuctioneerStreamer;
