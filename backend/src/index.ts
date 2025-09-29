import Fastify from "fastify";
import cors from "@fastify/cors";
import { Configuration } from "./configuration.js";
import { HttpStatusCode } from "./globals.js";

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: "*" });

fastify.get("/ping", async (request, reply) => {
  request.log.info("ping req");
  return "pong\n";
});

fastify.get("/sse", async (request, reply) => {
  reply.raw.writeHead(HttpStatusCode.SUCCESS, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    const data = `data: New message ${counter}\n\n`;
    reply.raw.write(data);

    if (counter >= 5) {
      clearInterval(interval);
      reply.raw.end();
    }
  }, 1000);

  request.socket.on("close", () => {
    clearInterval(interval);
  });
});

fastify.listen({ port: Configuration.httpServer.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
