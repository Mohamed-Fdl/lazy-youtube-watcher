import { type Static, Type } from "@sinclair/typebox";

export const WebSocketParams = Type.Object({
  chatId: Type.String(),
});

export type WebSocketParamsType = Static<typeof WebSocketParams>;
