import { AccessToken } from 'livekit-server-sdk';

// Replace with your API Key and Secret from config.yaml
const apiKey = 'MUNDO_CAMIONES';
const apiSecret =
  'mundocamionestwZVk80SiduWr5szsXYgkXaHAbMeHXBiOltXAPT0gfbpGKaW7jIiQANVrQvDRm6tNahsWK5kIGIagIcjCygqbJqxE02DsAzvPwDFWJi8c9nNJUpPCr7';

/**
 * Generate a LiveKit token for a client or auctioneer.
 * @param identity - Unique identifier for the participant (e.g., clientId or auctioneerId)
 * @param room - Name of the room the participant will join
 * @param canPublish - Whether the participant can publish tracks (video/audio)
 * @param canSubscribe - Whether the participant can subscribe to tracks
 * @returns A signed JWT token for LiveKit
 */
export const generateToken = async (
  identity: string,
  room: string,
  canPublish: boolean,
  canSubscribe: boolean
): Promise<string> => {
  try {
    // Create a new access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity, // Set the unique identity for the participant
    });

    // Add the necessary grants
    token.addGrant({
      roomJoin: true,
      room, // Specify the room name
      canPublish, // Grant publish permissions
      canSubscribe, // Grant subscribe permissions
    });

    // Return the resolved token
    return token.toJwt();
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};
