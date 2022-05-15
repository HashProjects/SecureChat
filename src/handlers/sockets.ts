import { Event, Socket } from "socket.io";
import logging from "../config/logging";
import User from "../models/User";
import UserSocket from "../models/UserSocket";

const NAMESPACE = "sockets";

/**
 * The currently connected users
 */
let users: User[] = [];

/**
 * Handler for the initial connection
 * @param {UserSocket} sock
 */
export const connection = (socket: UserSocket) => {
  logging.debug(NAMESPACE, `SOCK 'connection' ${socket.id}`);

  /**
   * Send all online users
   */
  socket.emit("usersOnline", users);

  const user = new User(socket.user.name, socket.user.id);

  users.push(user);

  /**
   * Middleware logging for sockets
   * @param {Event} event - list of arguments
   */
  socket.use((event: Event, next) => {
    logging.debug(NAMESPACE, `SOCK '${event[0]}' ${socket.id}`);
    next();
  });

  /**
   * On Socket disconnect
   */
  socket.on("disconnect", () => {
    logging.debug(NAMESPACE, `SOCK 'disconnect' ${socket.id}`);
  });
};
