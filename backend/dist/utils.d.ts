export declare const SendAwakenessCheckAlertMessage: (options: {
    chatId: string;
    youtubeVideoLink: string;
}) => Promise<void>;
export declare const SendTextMessage: (options: {
    chatId: string;
    text: string;
}) => Promise<void>;
export declare const getAwakenessAlertText: (youtubeVideoLink: string) => string;
export declare const getChatIdRequestMessage: (chatId: string) => string;
//# sourceMappingURL=utils.d.ts.map