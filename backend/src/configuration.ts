import type { ApplicationConfig } from "./types.ts";

export const Configuration: ApplicationConfig = {
  httpServer: {
    port: Number(process.env.PORT),
  },
};
