export declare enum HttpStatusCode {
    SUCCESS = 200
}
export declare const TelegramTokenSecretHeaderKey = "x-telegram-bot-api-secret-token";
export declare enum AwakenessCheckResponse {
    YES = "check.awakeness.yes",
    NO = "check.awakeness.no"
}
export declare enum EventsToEmit {
    PAUSE = "pause",
    RESUME = "resume"
}
export declare const EventsOnAwakenessCheckResponseMapping: Record<AwakenessCheckResponse, EventsToEmit>;
//# sourceMappingURL=globals.d.ts.map