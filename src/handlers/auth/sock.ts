import { auth } from "./helpers";
import logging from "../../config/logging";
import UserSocket from "../../models/UserSocket";
import { Socket } from "socket.io";
import { JSONCookie } from "cookie-parser";

const NAMESPACE = "sockAuth";

type AuthCookie = { auth: string | null };

export const sockAuth = async (socket: Socket, next: any) => {
  const cookies = JSONCookie(socket.request.headers?.cookie || "") as AuthCookie;
  const token = cookies?.auth;
  const user = await auth(token);
  if (!user) return next(new Error("Unauthorized. Missing Token"));

  (socket as UserSocket).user = user;

  next();
};
