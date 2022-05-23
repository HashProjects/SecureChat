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
const JWT_PUBLIC = process.env.PUBLIC_KEY || "keys/default_jwt.key.pub";
const DSA_PRIVATE = process.env.PRIVATE_KEY || "keys/default_dsa.key";
const DSA_PUBLIC = process.env.PUBLIC_KEY || "keys/default_dsa.key.pub";
const AUTH_EXPIRATION_SECONDS: number = +(process.env.AUTH_EXPIRATION_MINUTES || 60) * 60;
const SALT_ROUNDS: number = +(process.env.SALT_ROUNDS || 10);

const SERVER = {
  host: HOSTNAME,
  port: PORT,
};

const JWT = {
  public: JWT_PUBLIC,
  private: JWT_PRIVATE,
};

const DSA = {
  public: DSA_PUBLIC,
  private: DSA_PRIVATE,
}

const AUTH = {
  jwt: JWT,
  saltRounds: SALT_ROUNDS,
  expire: AUTH_EXPIRATION_SECONDS
};

const config = {
  server: SERVER,
  logLevel: LOG_LEVEL,
  rootDir: ROOT_DIR,
  auth: AUTH,
  dsa: DSA,
};

export default config;
