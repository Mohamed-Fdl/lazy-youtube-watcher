export var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["SUCCESS"] = 200] = "SUCCESS";
})(HttpStatusCode || (HttpStatusCode = {}));
export const TelegramTokenSecretHeaderKey = "x-telegram-bot-api-secret-token";
export var AwakenessCheckResponse;
(function (AwakenessCheckResponse) {
    AwakenessCheckResponse["YES"] = "check.awakeness.yes";
    AwakenessCheckResponse["NO"] = "check.awakeness.no";
})(AwakenessCheckResponse || (AwakenessCheckResponse = {}));
export var EventsToEmit;
(function (EventsToEmit) {
    EventsToEmit["PAUSE"] = "pause";
    EventsToEmit["RESUME"] = "resume";
})(EventsToEmit || (EventsToEmit = {}));
export const EventsOnAwakenessCheckResponseMapping = {
    [AwakenessCheckResponse.YES]: EventsToEmit.RESUME,
    [AwakenessCheckResponse.NO]: EventsToEmit.PAUSE,
};
//# sourceMappingURL=globals.js.map