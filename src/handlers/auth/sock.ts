import { auth } from "./helpers";
import logging from "../../config/logging";
import UserSocket from "../../models/UserSocket";
import { Socket } from "socket.io";
import { parse } from "cookie";

const NAMESPACE = "sockAuth";

export const sockAuth = async (socket: Socket, next: any) => {
  const cookies = parse(socket.request.headers.cookie || "");
  const token = cookies?.auth;
  const user = await auth(token);
  if (!user) {
    logging.debug(NAMESPACE, "Unauthorized Socket Connection");
    return next(new Error("Unauthorized. Missing Token"));
  }

  (socket as UserSocket).user = user;

  next();
};
