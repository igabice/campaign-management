import Redis from "ioredis";
import  MockRedis from "ioredis-mock";

const redis = process.env.NODE_ENV === 'test' 
  ? new MockRedis()
  :new Redis(`${process.env.REDIS_URL}`);

export default redis;
