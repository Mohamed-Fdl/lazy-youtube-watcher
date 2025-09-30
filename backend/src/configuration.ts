import dotenv from "dotenv";
import type { ApplicationConfig } from "./types.ts";

dotenv.config();

export const Configuration: ApplicationConfig = {
  httpServer: {
    port: Number(process.env.PORT),
    logLevel: process.env.LOG_LEVEL || "info",
  },
  telegram: {
    baseUrl: String(process.env.TELEGRAM_API_BASE_URL),
    botToken: String(process.env.TELEGRAM_BOT_TOKEN),
    secretHeaderToken: String(process.env.TELEGRAM_WEBHOOK_SECRET_KEY),
  },
};
