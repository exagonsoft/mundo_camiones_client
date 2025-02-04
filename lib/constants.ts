import countries from 'world-countries';

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
  //baseAuctionUrl: "http://localhost:4040",
  baseBusinessUrl: "https://subastas.business.martinnotaryfl.com",
  //baseBusinessUrl: "http://localhost:4080",
  prodUrl: "https://subastas.client.martinnotaryfl.com",
  streamingUrl: "https://subastas.streaming.martinnotaryfl.com"
}

// Convert country data into dropdown format
export const countryOptions = countries.map((c) => ({
  value: c.cca2,
  label: c.name.common,
}));

export const rolesOptions = [
  {
    value: '',
    label: 'Seleccione uno'
  },
  {
    value: 'admin',
    label: 'Administrador'
  },
  {
    value: 'user',
    label: 'Usuario'
  },
  {
    value: 'auct',
    label: 'Martillero'
  },
];

