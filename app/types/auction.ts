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
  _id: string;
  title: string;
  description: string;
  startPrice: number;
  increment: number;
  media: StaticMedia[];
}

// Represents an auction containing multiple lots
export interface Auction {
  _id: string;
  startDate: Date;
  endDate: Date;
  auctioneerId: string;
  vehicles: string[];
  active: boolean;
}

export interface AuctionDetail {
  _id: string;
  startDate: Date;
  endDate: Date;
  auctioneerId: string;
  vehicles: Vehicle[];
  active: boolean;
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

export interface VehicleMedia {
  type: "image" | "video" | "unknown"; // Restrict type to "image" or "video"
  url: string;
}

export interface Vehicle {
  _id: string;
  title: string;
  description: string;
  country: string;
  price: number;
  media: VehicleMedia[];
}

export interface VehicleListResponse {
  data: Vehicle[] | null;
  errors: string | null;
}

export interface AuctionListResponse {
  data: Auction[] | null;
  errors: string | null;
}

export interface AuctionDetailsResponse {
  data: AuctionDetail | null;
  errors: string | null;
}

export interface UserListResponse {
  data: User[] | null;
  errors: string | null;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  role: string;
}
