import { auth } from "./helpers";
import logging from "../../config/logging";
import UserSocket from "../../models/UserSocket";
import { Socket } from "socket.io";

const NAMESPACE = "sockAuth";

export const sockAuth = async (socket: Socket, next: any) => {
  const unAuth = () => next(new Error("Unauthorized. Missing Token"));
  const token = socket.handshake.auth?.token as string;

  if (!token) return unAuth();

  const user = await auth(token);
  if (!user) return unAuth();

  (socket as UserSocket).user = user;

  logging.debug(NAMESPACE, "auth successful");

  next();
};
