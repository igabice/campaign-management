import { Server } from "http";
import app from "./app";
import config from "./config/config";
import prisma from "./config/prisma";
import logger from "./config/logger";

const server: Server = app.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});

prisma.$connect().then(() => {
  logger.info("Connected to database");
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
