import { LinkType } from "@/app/types/customTypes";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  IconBell,
  IconBox,
  IconHammer,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { config } from "@/app/config/settings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLinks = (isAdmin?: boolean): LinkType[] => {
  const _navLinks = isAdmin
    ? [
        {
          name: "Subastas",
          href: "/auctioneer/auctions",
          icon: IconHammer,
        },
        {
          name: "Lotes",
          href: "/auctioneer/lots",
          icon: IconBox,
        },
        {
          name: "Publicaciones",
          href: "/auctioneer/vehicles",
          icon: IconTruck,
        },
        { name: "Usuarios", href: "/auctioneer/users", icon: IconUser },
        {
          name: "Notificaciones",
          href: "/auctioneer/notifications",
          icon: IconBell,
        },
      ]
    : [
        {
          name: "Subastas",
          href: "/client/auctions",
          icon: IconHammer,
        },
        {
          name: "Publicaciones",
          href: "/client/vehicles",
          icon: IconTruck,
        },
        {
          name: "Notificaciones",
          href: "/client/notifications",
          icon: IconBell,
        },
      ];

  return _navLinks;
};

export function checkMimeType(file: File) {
  if (!file || !file.type) return "unknown";

  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";

  return "unknown";
}

export const uploadToS3 = async (file: File): Promise<string> => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID!,
      secretAccessKey: "QEf27k1nQACGimpHDm8CU8yLfeCQHaqpDYjvnrpu",
    },
    region: config.AWS_REGION! || "us-west-2",
  });

  // Determine media type
  const mediaType = file.type.startsWith("image/") ? "image" : "video";

  // Generate a unique filename
  const fileKey = `${mediaType}/${Date.now()}_${file.name}`;
  const fileBuffer = await file.arrayBuffer();
  const uint8ArrayBuffer = new Uint8Array(fileBuffer);

  const putParams = {
    Bucket: config.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: uint8ArrayBuffer,
    ContentType: file.type,
  };

  const putCommand = new PutObjectCommand(putParams);
  await s3Client.send(putCommand);

  // Return the public S3 URL
  return `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${fileKey}`;
};
