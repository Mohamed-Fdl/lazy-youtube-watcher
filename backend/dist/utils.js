import axios from "axios";
import { Configuration } from "./configuration.js";
import { AwakenessCheckResponse } from "./globals.js";
const { baseUrl, botToken } = Configuration.telegram;
export const SendAwakenessCheckAlertMessage = async (options) => {
    const { chatId, youtubeVideoLink } = options;
    await axios.post(`${baseUrl}/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        parse_mode: "HTML",
        text: getAwakenessAlertText(youtubeVideoLink),
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Yes✅",
                        callback_data: AwakenessCheckResponse.YES,
                    },
                ],
                [
                    {
                        text: "No❌",
                        callback_data: AwakenessCheckResponse.NO,
                    },
                ],
            ],
        },
    });
    return;
};
export const getAwakenessAlertText = (youtubeVideoLink) => {
    return `🚨🚨🚨🚨<b>Are you awake?</b>🚨🚨🚨🚨<b>Video Link:</b> ${youtubeVideoLink}`;
};
//# sourceMappingURL=utils.js.map