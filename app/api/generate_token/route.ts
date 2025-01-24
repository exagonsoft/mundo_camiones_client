import { AccessToken } from "livekit-server-sdk";

const apiKey = "MUNDO_CAMIONES";
const apiSecret =
  "mundocamionestwZVk80SiduWr5szsXYgkXaHAbMeHXBiOltXAPT0gfbpGKaW7jIiQANVrQvDRm6tNahsWK5kIGIagIcjCygqbJqxE02DsAzvPwDFWJi8c9nNJUpPCr7";

// API handler
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const { identity, room, canPublish, canSubscribe } = body;

    if (!identity || !room) {
      return new Response(JSON.stringify({ error: "Identity and room are required" }), { status: 400 });
    }

    // Generate LiveKit token
    const token = new AccessToken(apiKey, apiSecret, {
      identity,
    });

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: !!canPublish,
      canSubscribe: !!canSubscribe,
    });

    const _token = await token.toJwt();

    return new Response(
      JSON.stringify({ token: _token }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    return new Response(JSON.stringify({ error: "Failed to generate token" }), { status: 500 });
  }
}
