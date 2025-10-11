import { Server } from "http";
import app from "./app";
import config from "./config/config";
import prisma from "./config/prisma";
import logger from "./config/logger";
import { startCronJobs, stopCronJobs } from "./scheduler";

// Determine app mode from environment variable (default: "app")
const appMode = process.env.APP || "app";

const startApp = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info("Connected to database");

    if (appMode === "scheduler") {
      // Start scheduler mode
      logger.info("Starting in scheduler mode");

      // Start cron jobs
      startCronJobs();

      logger.info("Scheduler started successfully");

      // Graceful shutdown handling for scheduler
      const shutdown = () => {
        logger.info("Shutting down scheduler...");
        stopCronJobs();
        prisma
          .$disconnect()
          .then(() => {
            logger.info("Database connection closed");
            process.exit(0);
          })
          .catch((err) => {
            logger.error("Error closing database connection:", err);
            process.exit(1);
          });
      };

      process.on("SIGTERM", shutdown);
      process.on("SIGINT", shutdown);

      // Keep the process running
      process.stdin.resume();
    } else {
      // Start HTTP server mode (default)
      logger.info("Starting in app mode");

      const server: Server = app.listen(config.port, () => {
        logger.info(`HTTP server listening on port ${config.port}`);
      });

      process.on("SIGTERM", () => {
        logger.info("SIGTERM received for HTTP server");
        if (server) {
          server.close();
        }
      });
    }
  } catch (error) {
    logger.error(`Failed to start ${appMode}:`, error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
const unexpectedErrorHandler = (error: unknown) => {
  logger.error(`Uncaught Exception in ${appMode}:`, error);
  if (appMode === "scheduler") {
    stopCronJobs();
  }
  process.exit(1);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection in ${appMode}:`, reason);
  if (appMode === "scheduler") {
    stopCronJobs();
  }
  process.exit(1);
});

startApp();
