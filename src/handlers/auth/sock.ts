import { auth } from "./helpers";
import logging from "../../config/logging";
import UserSocket from "../../models/UserSocket";
import { Socket } from "socket.io";

const NAMESPACE = "sockAuth";

export const sockAuth = async (socket: Socket, next: any) => {
  const token = socket.handshake.auth?.token as string;

  if (!token) return next(new Error("Unauthorized. Missing Token"));

  const data = await auth(token);
  if (!data) return next(new Error("Unauthorized. Invalid Token"));

  (socket as UserSocket).username = data.username;
  (socket as UserSocket).id = data.id;

  logging.debug(NAMESPACE, "auth successful");

  next();
};
