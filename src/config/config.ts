import dotenv from "dotenv";
import { LEVEL } from "node-color-log";
import logging from "./logging";
import path from "path";
dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT: number = +(process.env.PORT ?? 8888);
const LOG_LEVEL: LEVEL = (process.env.LOG_LEVEL as LEVEL) || "debug";
const ROOT_DIR = path.join(__dirname + "../../..");
const JWT_PRIVATE = process.env.PRIVATE_KEY || "keys/default_jwt.key";
const JWT_PUBLIC = process.env.PUBLIC_KEY || "keys/default_jwt.pub";

const SERVER = {
  host: HOSTNAME,
  port: PORT,
};

const JWT = {
  public: JWT_PUBLIC,
  private: JWT_PRIVATE,
};

const config = {
  server: SERVER,
  logLevel: LOG_LEVEL,
  rootDir: ROOT_DIR,
  jwt: JWT,
};

export default config;
