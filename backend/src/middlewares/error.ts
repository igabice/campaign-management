import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";

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


export const errorHandler: ErrorRequestHandler = (err, _, res) => {
  const { statusCode, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
  };

  logger.error(err);
  
  res.status(statusCode).send(response);
};
