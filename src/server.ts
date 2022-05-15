import http from "http";
import express from "express";
import config from "./config/config";
import logging from "./config/logging";
import { Server, Socket } from "socket.io";
import api from "./routes/api";
import main from "./routes/main";
import { connection } from "./handlers/sockets";
import { logger, notFound } from "./handlers/middleware";
import cookieParser from "cookie-parser";
import { sockAuth } from "./handlers/auth/sock";

const NAMESPACE = "index";
const HOST = config.server.host;
const PORT = config.server.port;

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

/**
 * Puts url encoded data into the request body
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Converts the request body to json
 */
app.use(express.json());

/**
 * Parses cookies from request header
 */
app.use(cookieParser());

/**
 * Logs all requests and responses
 */
app.use(logger);

/**
 * Try to find the file in the public directory
 */
app.use(express.static("public"));

/**
 * Routes to the api router
 */
app.use("/api", api);

/**
 * Routes to the main router
 */
app.use("/", main);

/**
 * 404 Error handling
 */
app.use(notFound);

/**
 * Authenticate all socket messages
 */
io.use(sockAuth);

/**
 * Socket Connection
 */
io.on("connection", connection as (socket: Socket) => void);

/**
 * Start listening on port
 */
server.listen(PORT, HOST, () => {
  logging.info(NAMESPACE, `Server running on http://${HOST}:${PORT}`);
});

export default {
  app,
  server,
  io,
};
