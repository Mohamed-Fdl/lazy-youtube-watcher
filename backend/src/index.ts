import Fastify from "fastify";
import cors from "@fastify/cors";
import WebSocket from "@fastify/websocket";
import { Configuration } from "./configuration.js";
import { WebSocketParams, type WebSocketParamsType } from "./schema.js";
import {
  AwakenessCheckResponse,
  EventsOnAwakenessCheckResponseMapping,
  GET_CHAT_ID_COMMAND,
  ServerEventsHandled,
  SocketEventHandling,
  TelegramTokenSecretHeaderKey,
} from "./globals.js";
import type {
  TelegramCallbackQueyUpdate,
  TelegramMessageUpdate,
} from "./types.js";
import { getChatIdRequestMessage, SendTextMessage } from "./utils.js";

const Chats: Map<number, WebSocket.WebSocket> = new Map();

const fastify = Fastify({
  logger: { level: Configuration.httpServer.logLevel },
});

await fastify.register(cors, { origin: "*" });

await fastify.register(WebSocket);

fastify.register(async function (fastify) {
  fastify.get(
    "/:chatId",
    { websocket: true, schema: { params: WebSocketParams } },
    (socket, req) => {
      const params = req.params as WebSocketParamsType;
      const chatId = Number(params.chatId);

      socket.on("message", async (message: Buffer) => {
        const { event, data } = JSON.parse(message.toString());

        const executor =
          SocketEventHandling[event as unknown as ServerEventsHandled];
        if (!executor) return;

        await executor(data);
      });

      socket.on("close", () => {
        req.log.info(`[client disconnected]: ${chatId}`);
        Chats.delete(chatId);
        socket.close();
      });

      Chats.set(chatId, socket);
    }
  );
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

  const body = request.body as TelegramMessageUpdate;
  if ("message" in body && body.message.text === GET_CHAT_ID_COMMAND) {
    const chatId = String(body.message.chat.id);
    request.log.info(`user request for chat id: ${chatId}`);
    await SendTextMessage({ chatId, text: getChatIdRequestMessage(chatId) });
    return;
  }

  try {
    const { callback_query } = request.body as TelegramCallbackQueyUpdate;
    const { data, message } = callback_query;
    const textMessage = data as AwakenessCheckResponse;
    const chatId = message.chat.id;

    if (!Object.values(AwakenessCheckResponse).includes(textMessage)) {
      request.log.info(`unknown callback data response: ${textMessage}`);
      reply.send({ status: "ko", error: "Unknown callback data response" });
      return;
    }

    const socket = Chats.get(chatId) as WebSocket.WebSocket;
    if (!socket) {
      request.log.info(`realtime connection not found for chat: ${chatId}`);
      reply.send({ status: "ko", error: "Realtime connection not found" });
      return;
    }
    socket.send(
      JSON.stringify({
        event: EventsOnAwakenessCheckResponseMapping[textMessage],
        data: null,
      })
    );

    reply.send({ status: "ok" });
    return;
  } catch (error) {
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
