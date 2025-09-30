import type { HandleSocketEvent } from "./types.js";
export declare enum HttpStatusCode {
    SUCCESS = 200
}
export declare const TelegramTokenSecretHeaderKey = "x-telegram-bot-api-secret-token";
export declare enum AwakenessCheckResponse {
    YES = "check.awakeness.yes",
    NO = "check.awakeness.no"
}
export declare enum Events {
    PAUSE = "pause",
    RESUME = "resume"
}
export declare enum ServerEventsHandled {
    CHECK_AWAKENESS = "check.awakeness"
}
export declare const EventsOnAwakenessCheckResponseMapping: Record<AwakenessCheckResponse, Events>;
export declare const SocketEventHandling: Record<ServerEventsHandled, HandleSocketEvent>;
//# sourceMappingURL=globals.d.ts.map