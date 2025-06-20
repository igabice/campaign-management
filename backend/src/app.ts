import express from "express";
import cors from "cors";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares/error";
import ApiError from "./utils/ApiError";
import routes from "./routes";
import { initializeRedisClient } from "./middlewares/cache";
import logger from "./config/logger";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

initializeRedisClient().then(() => {
  logger.info("Redis client initialization attempted.");
}).catch((err) => {
  logger.error("Failed to initialize Redis client:", err);
});


app.get("/", (_, res) => {
  res.redirect("/v1/docs/swagger");
});

app.use("/v1", routes);

//404
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
