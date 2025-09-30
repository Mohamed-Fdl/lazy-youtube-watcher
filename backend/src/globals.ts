import type { HandleSocketEvent } from "./types.js";
import { SendAwakenessCheckAlertMessage } from "./utils.js";

export enum HttpStatusCode {
  SUCCESS = 200,
}

export const TelegramTokenSecretHeaderKey = "x-telegram-bot-api-secret-token";

export enum AwakenessCheckResponse {
  YES = "check.awakeness.yes",
  NO = "check.awakeness.no",
}

export enum Events {
  PAUSE = "pause",
  RESUME = "resume",
}

export enum ServerEventsHandled {
  CHECK_AWAKENESS = "check.awakeness",
}

export const EventsOnAwakenessCheckResponseMapping: Record<
  AwakenessCheckResponse,
  Events
> = {
  [AwakenessCheckResponse.YES]: Events.RESUME,
  [AwakenessCheckResponse.NO]: Events.PAUSE,
};

export const SocketEventHandling: Record<
  ServerEventsHandled,
  HandleSocketEvent
> = {
  [ServerEventsHandled.CHECK_AWAKENESS]: SendAwakenessCheckAlertMessage,
};
