/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Socket } from "socket.io-client";

const useSocketEvent = (
  socket: Socket | null,
  event: string,
  handler: (...args: any[]) => void
) => {
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};

export default useSocketEvent;
