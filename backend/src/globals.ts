export enum HttpStatusCode {
  SUCCESS = 200,
}

export const TelegramTokenSecretHeaderKey = "x-telegram-bot-api-secret-token";

export enum AwakenessCheckResponse {
  YES = "check.awakeness.yes",
  NO = "check.awakeness.no",
}

export enum EventsToEmit {
  PAUSE = "pause",
  RESUME = "resume",
}

export const EventsOnAwakenessCheckResponseMapping: Record<
  AwakenessCheckResponse,
  EventsToEmit
> = {
  [AwakenessCheckResponse.YES]: EventsToEmit.RESUME,
  [AwakenessCheckResponse.NO]: EventsToEmit.PAUSE,
};
