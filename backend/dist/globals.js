import { SendAwakenessCheckAlertMessage } from "./utils.js";
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
export var Events;
(function (Events) {
    Events["PAUSE"] = "pause";
    Events["RESUME"] = "resume";
})(Events || (Events = {}));
export var ServerEventsHandled;
(function (ServerEventsHandled) {
    ServerEventsHandled["CHECK_AWAKENESS"] = "check.awakeness";
})(ServerEventsHandled || (ServerEventsHandled = {}));
export const EventsOnAwakenessCheckResponseMapping = {
    [AwakenessCheckResponse.YES]: Events.RESUME,
    [AwakenessCheckResponse.NO]: Events.PAUSE,
};
export const SocketEventHandling = {
    [ServerEventsHandled.CHECK_AWAKENESS]: SendAwakenessCheckAlertMessage,
};
//# sourceMappingURL=globals.js.map