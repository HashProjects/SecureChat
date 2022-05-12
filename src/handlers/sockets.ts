import { Event, Socket } from "socket.io";
import logging from "../config/logging";
import User from "../models/User";

const NAMESPACE = "sockets";

/**
 * The currently connected users
 */
let users: User[];

/**
 * Handler for the initial connection
 * @param {Socket} socket
 */
export const connection = (socket: Socket) => {
  logging.info(NAMESPACE, `SOCK 'connection' ${socket.id}`);

  /**
   * Send all online users
   */
  socket.emit("usersOnline", users);

  /**
   * Middleware logging for sockets
   * @param {Event} event - list of arguments
   */
  socket.use((event: Event, next) => {
    logging.info(NAMESPACE, `SOCK '${event[0]}' ${socket.id}`);
    next();
  });

  /**
   * On Socket disconnect
   */
  socket.on("disconnect", () => {
    logging.info(NAMESPACE, `SOCK 'disconnect' ${socket.id}`);
  });
};
