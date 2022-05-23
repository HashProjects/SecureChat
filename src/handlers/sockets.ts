import { Event, Socket } from "socket.io";
import logging from "../config/logging";
import User from "../models/User";
import UserSocket from "../models/UserSocket";
import { io } from "../server";

const NAMESPACE = "sockets";

/**
 * The currently connected users
 */
let users: User[] = [];

/**
 * Handler for the initial connection
 * @param {UserSocket} socket
 */
export const connection = (socket: UserSocket) => {
  logging.debug(NAMESPACE, `SOCK 'connection' ${socket.id}`);

  /**
   * Middleware logging for sockets
   * @param {Event} event - list of arguments
   */
  socket.use((event: Event, next) => {
    logging.debug(NAMESPACE, `SOCK '${event[0]}' ${socket.id}`);
    next();
  });

  /**
   * Send all online users
   */
  socket.broadcast.emit("userConnect", socket.user);
  socket.emit("usersOnline", users);

  const user = new User(socket.user.name, "", "", socket.user.id);
  users.push(user);

  /**
   * When the user sends a message
   */
  socket.on("message", (msg) => {
    // Add message to DB
    socket.nsp.emit("message", socket.user.name, msg);
  });

  /**
   * On Socket disconnect
   */
  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == socket.user.id) users.splice(i, 1);
    }
    socket.broadcast.emit("userDisconnect", socket.user);
    logging.debug(NAMESPACE, `SOCK 'disconnect' ${socket.id}`);
  });
};
