import express from "express";
import cors from "cors";
// import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares/error";
// import ApiError from "./utils/ApiError";
import routes from "./routes";
import { initializeRedisClient } from "./middlewares/cache";
import logger from "./config/logger";
import { auth } from "./config/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();

// Parse CORS origins from environment variable or use defaults
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000",
      "https://www.dokahub.com",
      "https://dokahub.com",
      "https://api.dokahub.com",
    ];

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

initializeRedisClient()
  .then(() => {
    logger.info("Redis client initialization attempted.");
  })
  .catch((err) => {
    logger.error("Failed to initialize Redis client:", err);
  });

app.get("/", (req, res) => {
  // Don't redirect to swagger if it's an auth callback or API request
  if (
    req.path.startsWith("/api/") ||
    req.query.code ||
    req.query.state ||
    req.query.error
  ) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.redirect("/v1/docs/swagger");
  }
});

app.use("/v1", routes);

// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

app.use(errorConverter);
app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({
    message: "Server is up",
    endpoints: {
      public: "/api/public",
    },
  });
});

export default app;
