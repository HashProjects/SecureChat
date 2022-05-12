import dotenv from "dotenv";
import { LEVEL } from "node-color-log";
import logging from "./logging";
import path from "path";
dotenv.config();

const HOSTNAME = process.env.HOSTNAME ?? "localhost";
const PORT: number = +(process.env.PORT ?? 8888);
const LOG_LEVEL: LEVEL = (process.env.LOG_LEVEL as LEVEL) ?? "debug";
const ROOT_DIR = path.join(__dirname + "../../..")

const SERVER = {
  host: HOSTNAME,
  port: PORT,
};

const config = {
  server: SERVER,
  logLevel: LOG_LEVEL,
  rootDir: ROOT_DIR,
};

export default config;
