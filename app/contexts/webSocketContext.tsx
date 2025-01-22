/* eslint-disable react-hooks/exhaustive-deps */
// /contexts/WebSocketContext.tsx
import { config } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextProps {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextProps>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const { data: session } = useSession();

  const socketStatus = () => {
    socket.current = io(config.baseAuctionUrl, {
      auth: {
        token: `Bearer ${session?.user.accessToken?.access_token}`, // Replace with dynamic token retrieval
      },
    });

    socket.current.on('connect', () => console.log('WebSocket connected'));
    socket.current.on('disconnect', () => console.log('WebSocket disconnected'));

    return () => socket.current?.disconnect();
  }

  useEffect(() => {
    if(session){
      socketStatus()
    }
  }, [session]);

  return (
    <WebSocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};
