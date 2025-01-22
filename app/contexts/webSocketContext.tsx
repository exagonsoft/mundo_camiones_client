/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { config } from "@/lib/constants";

interface WebSocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => {},
  off: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Tracks WebSocket connection status
  const { data: session } = useSession();

  // Connect to WebSocket server
  const connectSocket = useCallback(() => {
    if (!session?.user.accessToken?.access_token) {
      console.warn("Access token is not available, skipping socket connection.");
      return;
    }

    socket.current = io(config.baseAuctionUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: `Bearer ${session?.user.accessToken?.access_token}`,
      },
    });

    socket.current.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    socket.current.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socket.current.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
      setIsConnected(false);
    });

    return () => {
      socket.current?.disconnect();
      setIsConnected(false);
    };
  }, [session]);

  // Disconnect socket on cleanup
  useEffect(() => {
    if (session) {
      connectSocket();
    }
    return () => {
      socket.current?.disconnect();
    };
  }, [session, connectSocket]);

  // Emit function
  const emit = useCallback((event: string, data?: any) => {
    if (socket.current?.connected) {
      socket.current.emit(event, data);
    } else {
      console.warn("Cannot emit event. WebSocket is not connected.");
    }
  }, []);

  // On function
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socket.current) {
      socket.current.on(event, callback);
    }
  }, []);

  // Off function
  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socket.current) {
      if (callback) {
        socket.current.off(event, callback);
      } else {
        socket.current.off(event);
      }
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket: socket.current, isConnected, emit, on, off }}>
      {children}
    </WebSocketContext.Provider>
  );
};
