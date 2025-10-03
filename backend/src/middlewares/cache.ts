/* eslint-disable @typescript-eslint/no-explicit-any */
import Redis from "ioredis";
import MockRedis from "ioredis-mock";
import hash from "object-hash";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const redis: Redis =
  process.env.NODE_ENV === "test"
    ? new MockRedis()
    : new Redis(`${process.env.REDIS_URL}`);

redis.on("error", (err: Error) => {
  logger.error(`[Redis Client] Connection Error:`, err);
});

redis.on("connect", () => {
  logger.info(`[Redis Client] Connected to Redis successfully!`);
});

redis.on("reconnecting", () => {
  logger.warn(`[Redis Client] Reconnecting to Redis...`);
});

redis.on("end", () => {
  logger.info(`[Redis Client] Connection to Redis ended.`);
});

async function initializeRedisClient(): Promise<void> {
  if (!process.env.REDIS_URL && process.env.NODE_ENV !== "test") {
    logger.warn(
      `[Redis] REDIS_URL environment variable not set. Redis caching might be disabled or problematic.`
    );
  }

  try {
    if (
      redis.status === "connecting" ||
      redis.status === "connect" ||
      redis.status === "ready"
    ) {
      await redis.ping();
      logger.info(`[Redis] Redis client is ready for use.`);
    } else {
      logger.warn(
        `[Redis] Redis client status is '${redis.status}'. It might not be fully ready.`
      );
    }
  } catch (err: any) {
    logger.error(`[Redis] Failed to ping Redis after initialization:`, err);
  }
}

function requestToKey(req: Request): string {
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  };
  return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

function isRedisWorking(): boolean {
  return redis.status === "ready";
}

async function writeData(
  key: string,
  data: string | Buffer,
  options?: { EX?: number; PX?: number }
): Promise<void> {
  if (isRedisWorking()) {
    try {
      if (options?.EX) {
        await redis.set(key, data, "EX", options.EX);
      } else if (options?.PX) {
        await redis.set(key, data, "PX", options.PX);
      } else {
        await redis.set(key, data);
      }
    } catch (e: any) {
      logger.error(`[Redis] Failed to cache data for key=${key}:`, e);
    }
  } else {
    logger.warn(
      `[Redis] Redis client not ready, skipping write for key=${key}`
    );
  }
}

async function readData(key: string): Promise<string | null | undefined> {
  if (isRedisWorking()) {
    try {
      return await redis.get(key);
    } catch (e: any) {
      logger.error(`[Redis] Failed to read cached data for key=${key}:`, e);
      return undefined;
    }
  }
  return undefined;
}

async function invalidateAllCaches(): Promise<void> {
  if (!isRedisWorking()) {
    logger.warn("[Redis] Redis not working, cannot invalidate all caches.");
    return;
  }

  try {
    await redis.flushdb();
    logger.info(
      `[Redis] All caches in the current database have been invalidated (FLUSHDB).`
    );
  } catch (e: any) {
    logger.error(`[Redis] Failed to invalidate all caches (FLUSHDB):`, e);
  }
}

function redisCachingMiddleware(
  options: { EX?: number; PX?: number } = { EX: 21600 }
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (isRedisWorking()) {
      const key = requestToKey(req);
      const cachedValue = await readData(key);

      if (cachedValue) {
        try {
          logger.debug(`[Redis Middleware] Cache hit for key: ${key}`);
          res.json(JSON.parse(cachedValue));
          return;
        } catch (e: any) {
          logger.warn(
            `[Redis Middleware] Failed to parse cached value for key: ${key}. Sending as plain text.`,
            e
          );
          res.send(cachedValue);
          return;
        }
      } else {
        const oldSend = res.send;
        res.send = function (this: Response, data: any) {
          res.send = oldSend;

          if (res.statusCode.toString().startsWith("2")) {
            logger.debug(`[Redis Middleware] Caching response for key: ${key}`);
            writeData(key, JSON.stringify(data), options).catch((e) => {
              logger.error(
                `[Redis Middleware] Error writing data to cache for key ${key}:`,
                e
              );
            });
          }

          // eslint-disable-next-line prefer-rest-params
          return oldSend.apply(this, arguments as any);
        } as typeof res.send;

        next();
      }
    } else {
      // logger.warn("[Redis Middleware] Redis not working, skipping cache for this request.");
      next();
    }
  };
}

export {
  initializeRedisClient,
  redisCachingMiddleware,
  invalidateAllCaches,
  redis,
};
