import http from "http";
import express from "express";
import config from "./config/config";
import logging from "./config/logging";
import { Server } from "socket.io";
import { register, login } from "./controllers/auth";

const NAMESPACE = "index";
const HOST = config.server.host;
const PORT = config.server.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/**
 * Logs all requests and responses
 */
app.use((req, res, next) => {
  logging.info(NAMESPACE, `${req.method} '${req.url}'`);

  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `${req.method} '${req.url}' -> ${res.statusCode} ${res.statusMessage} | ${req.socket.remoteAddress}`
    );
  });

  next();
});

app.use("/", (req, res) => {
  res.sendFile("/index.html");
});

app.use("/register", register)
app.use("/login", login)

io.on("connection", (socket) => {
  logging.info(NAMESPACE, "Connection");
});

server.listen(PORT, HOST, () => {
  logging.info(NAMESPACE, `Server running on http://${HOST}:${PORT}`);
});
