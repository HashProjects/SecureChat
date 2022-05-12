import { Event, Socket } from "socket.io";
import logging from "../config/logging";
import User from "../models/User";

const NAMESPACE = "sockets";

let fakeUser = new User("Bob");

/**
 * The currently connected users
 */
let users: User[] = [fakeUser];

/**
 * Handler for the initial connection
 * @param {Socket} socket
 */
export const connection = (socket: Socket) => {
  logging.info(NAMESPACE, `SOCK 'connection' ${socket.id}`);

  /**
   * Send all online users
   */
  socket.emit("online", users);

  /**
   * Middleware logging for sockets
   * @param {Event} e - list of arguments
   */
  socket.use((e: Event, next) => {
    logging.info(NAMESPACE, `SOCK '${e[0]}' ${socket.id}`);
    next();
  });

  /**
   * On Socket disconnect
   */
  socket.on("disconnect", () => {
    logging.info(NAMESPACE, `SOCK 'disconnect' ${socket.id}`);
  });
};
