import env from 'dotenv';

env.config();

export default {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3001,
};