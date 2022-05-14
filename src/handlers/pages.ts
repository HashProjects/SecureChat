import { Request, Response } from "express";
import config from "../config/config";
import path from "path";
import { auth } from "./auth/helpers";
import logging from "../config/logging";

const NAMESPACE = "pages";

const dir = (file: string) => {
  return path.join(config.rootDir + "/public/" + file);
};

export const home = async (req: Request, res: Response) => {
  const authed = await auth(req.cookies.auth);
  if (!authed) {
    res.clearCookie("auth");
    res.clearCookie("username");
    res.clearCookie("id");
    return res.redirect("/login");
  }
  res.redirect("/chat");
};

export const chat = async (req: Request, res: Response) => {
  const authed = await auth(req.cookies.auth);
  if (!authed) {
    res.clearCookie("auth");
    res.clearCookie("username");
    res.clearCookie("id");
    return res.redirect("/login");
  }
  res.sendFile(dir("chat.html"));
};

export const login = (req: Request, res: Response) => {
  res.sendFile(dir("login.html"));
};

export const register = (req: Request, res: Response) => {
  res.sendFile(dir("register.html"));
};
