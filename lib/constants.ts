export const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:your.turn.server",
    username: "username",
    credential: "password",
  },
];

export const mediaConstraints = {
  video: {
    width: { ideal: 1280 }, // Adjust to lower, e.g., 640 for lower quality
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: "user", // "environment" for back camera
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};

export const config = {
  baseAuthUrl: "https://subastas.auth.martinnotaryfl.com",
  baseAuctionUrl: "https://subastas.auction.martinnotaryfl.com",
  prodUrl: "https://subastas.client.martinnotaryfl.com",
  streamingUrl: "https://subastas.streaming.martinnotaryfl.com"
}

