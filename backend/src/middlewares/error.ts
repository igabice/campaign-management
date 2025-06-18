import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";
import config from "../config/config";

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }
  next(error);
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const { statusCode, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
  };

  if (config.env === 'dev') {
    logger.error(err);
  }
  
  res.status(statusCode).send(response);
};
