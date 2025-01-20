// /types/auction.ts
export interface StreamData {
  auctionId: string;
  media?: Blob | string; // Media can be binary or a URL
}

export interface Bid {
  auctionId: string,
  username: string,
  bidAmount: number
}

export interface TimerUpdate {
  remainingTime: number;
}


export interface StaticMedia {
  id: number;
  type: "image" | "video"; // Restrict type to "image" or "video"
  url: string;
  description: string;
};

export interface AuctionBid {
  auctionId: string,
  username: string,
  bidAmount: number
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