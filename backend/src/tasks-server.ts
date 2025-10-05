import prisma from "./config/prisma";
import logger from "./config/logger";
import { startCronJobs, stopCronJobs } from "./scheduler";

const startTasksServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info("Connected to database for tasks server");

    // Start cron jobs
    startCronJobs();

    logger.info(`Tasks server started successfully`);

    // Graceful shutdown handling
    const shutdown = () => {
      logger.info("Shutting down tasks server...");
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
  } catch (error) {
    logger.error("Failed to start tasks server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception in tasks server:", error);
  stopCronJobs();
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection in tasks server:", reason);
  stopCronJobs();
  process.exit(1);
});

startTasksServer();
