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

// import { toNodeHandler } from "better-auth/node";
// import { auth } from "./config/auth";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(cors());
// app.options("*", cors());

initializeRedisClient()
  .then(() => {
    logger.info("Redis client initialization attempted.");
  })
  .catch((err) => {
    logger.error("Failed to initialize Redis client:", err);
  });

app.get("/", (_, res) => {
  res.redirect("/v1/docs/swagger");
});

app.use("/v1", routes);

//404
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

app.use(errorConverter);
app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({
    message: "Better-Auth Express Server",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      public: "/api/public",
    },
    availableAuthRoutes: [
      "POST /api/auth/signup/email",
      "POST /api/auth/signin/email",
      "POST /api/auth/signout",
      "GET /api/auth/session",
      "GET /api/auth/oauth/google",
      "GET /api/auth/oauth/facebook",
      "POST /api/auth/forget-password",
      "POST /api/auth/reset-password",
    ],
  });
});

export default app;
