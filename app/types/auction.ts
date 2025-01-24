/* eslint-disable @typescript-eslint/no-explicit-any */
// /types/auction.ts
export interface StreamData {
  auctionId: string;
  media?: Blob | string; // Media can be binary or a URL
}

export interface Bid {
  auctionId: string;
  username: string;
  bidAmount: number;
}

export interface TimerUpdate {
  remainingTime: number;
}

export interface StaticMedia {
  id: number;
  type: "image" | "video"; // Restrict type to "image" or "video"
  url: string;
  description: string;
}

export interface AuctionBid {
  auctionId: string;
  username: string;
  bidAmount: number;
}

export interface AuctionLot {
  id: string;
  title: string;
  description: string;
  startPrice: number;
  increment: number;
  media: StaticMedia[];
}

// Represents an auction containing multiple lots
export interface Auction {
  id: string;
  lots: AuctionLot[];
}

export interface ClientToServerEvents {
  connectTransport: (data: {
    transportId: string;
    dtlsParameters: any;
  }) => void;
  produce: (
    data: { transportId: string; kind: string; rtpParameters: any },
    callback: (response: { id: string }) => void
  ) => void;
  consume: (
    data: { transportId: string },
    callback: (response: {
      id: string;
      producerId: string;
      kind: string;
      rtpParameters: any;
    }) => void
  ) => void;
}

export interface ServerToClientEvents {
  routerRtpCapabilities: (capabilities: any) => void;
  transportCreated: (transportOptions: any) => void;
  stream: (stream: MediaStream) => void;
}

export interface TransportInfo {
  id: string;
  iceParameters: any;
  iceCandidates: Array<any>;
  dtlsParameters: any;
}

export interface RtpCapabilities {
  codecs: Array<{
    mimeType: string;
    kind: string;
    clockRate: number;
    channels?: number;
  }>;
  headerExtensions: Array<any>;
  fecMechanisms: Array<any>;
}
