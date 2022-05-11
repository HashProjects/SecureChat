import dotenv from "dotenv";
import { LEVEL } from "node-color-log";
dotenv.config();

const HOSTNAME = process.env.HOSTNAME ?? "localhost";
const PORT: number = +(process.env.PORT ?? 8888);
const LOG_LEVEL: LEVEL = process.env.LOG_LEVEL as LEVEL ?? "debug";

const SERVER = {
  host: HOSTNAME,
  port: PORT,
};

const config = {
  server: SERVER,
  logLevel: LOG_LEVEL,
};

export default config;
