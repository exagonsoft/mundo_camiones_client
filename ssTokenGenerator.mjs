import { AccessToken } from 'livekit-server-sdk';

// Replace with your API Key and Secret from config.yaml
const apiKey = 'MUNDO_CAMIONES';
const apiSecret =
  'mundocamionestwZVk80SiduWr5szsXYgkXaHAbMeHXBiOltXAPT0gfbpGKaW7jIiQANVrQvDRm6tNahsWK5kIGIagIcjCygqbJqxE02DsAzvPwDFWJi8c9nNJUpPCr7';

// Function to generate tokens
async function generateTokens() {
  // Auctioneer Token (Publisher)
  const auctioneerToken = new AccessToken(apiKey, apiSecret, {
    identity: 'auctioneer-123',
  });
  auctioneerToken.addGrant({
    roomJoin: true,
    room: 'auction-room',
    canPublish: true,
    canSubscribe: false,
  });

  // Client Token (Subscriber)
  const clientToken = new AccessToken(apiKey, apiSecret, {
    identity: 'client-123',
  });
  clientToken.addGrant({
    roomJoin: true,
    room: 'auction-room',
    canPublish: false,
    canSubscribe: true,
  });

  // Output the resolved tokens
  console.log('Auctioneer Token:', await auctioneerToken.toJwt());
  console.log('Client Token:', await clientToken.toJwt());
}

// Call the function
generateTokens().catch((err) => {
  console.error('Error generating tokens:', err);
});
