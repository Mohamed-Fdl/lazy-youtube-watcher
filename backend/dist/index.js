import Fastify from "fastify";
import cors from "@fastify/cors";
import WebSocket from "@fastify/websocket";
import { Configuration } from "./configuration.js";
import { WebSocketParams } from "./schema.js";
import { AwakenessCheckResponse, EventsOnAwakenessCheckResponseMapping, ServerEventsHandled, SocketEventHandling, TelegramTokenSecretHeaderKey, } from "./globals.js";
import { ReadonlyFromMappedResult } from "@sinclair/typebox";
const Chats = new Map();
const fastify = Fastify({
    logger: { level: Configuration.httpServer.logLevel },
});
await fastify.register(cors, { origin: "*" });
await fastify.register(WebSocket);
fastify.register(async function (fastify) {
    fastify.get("/:chatId", { websocket: true, schema: { params: WebSocketParams } }, (socket, req) => {
        const params = req.params;
        const chatId = Number(params.chatId);
        socket.on("message", async (message) => {
            const { event, data } = JSON.parse(message.toString());
            const executor = SocketEventHandling[event];
            if (!executor)
                return;
            await executor(data);
        });
        socket.on("close", () => {
            req.log.info(`[client disconnected]: ${chatId}`);
            Chats.delete(chatId);
            socket.close();
        });
        Chats.set(chatId, socket);
    });
});
fastify.get("/", async (request, reply) => {
    console.log("[server is up]");
    reply.send({ status: "ok" });
});
fastify.post("/webhook", async (request, reply) => {
    request.log.info(`req-headers: ${JSON.stringify(request.headers)}`);
    request.log.info(`req-body: ${JSON.stringify(request.body)}`);
    const secretHeader = request.headers[TelegramTokenSecretHeaderKey];
    if (!(secretHeader === Configuration.telegram.secretHeaderToken)) {
        reply.send({ status: "ko", error: "Invalid header signature" });
        return;
    }
    try {
        const { callback_query } = request.body;
        const { data, message } = callback_query;
        const textMessage = data;
        const chatId = message.chat.id;
        if (!Object.values(AwakenessCheckResponse).includes(textMessage)) {
            request.log.info(`unknown callback data response: ${textMessage}`);
            reply.send({ status: "ko", error: "Unknown callback data response" });
            return;
        }
        const socket = Chats.get(chatId);
        if (!socket) {
            request.log.info(`realtime connection not found for chat: ${chatId}`);
            reply.send({ status: "ko", error: "Realtime connection not found" });
            return;
        }
        socket.send(JSON.stringify({
            event: EventsOnAwakenessCheckResponseMapping[textMessage],
            data: null,
        }));
        reply.send({ status: "ok" });
        return;
    }
    catch (error) {
        request.log.error(`Error on webhook handling: ${JSON.stringify(error)}`);
        reply.send({ status: "ko", error });
    }
});
fastify.listen({ port: Configuration.httpServer.port }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map