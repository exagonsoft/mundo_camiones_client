import dotenv from "dotenv";

dotenv.config();

export const config = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "mundo_camiones_secret",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "AKIAYT3ARFVDBXNMWTER",
  AWS_REGION: process.env.AWS_REGION || "us-west-2",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "mundo-camiones-demo",
};