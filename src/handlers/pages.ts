import { Request, Response } from "express";
import config from "../config/config";
import path from "path";
import { auth } from "./auth";
import logging from "../config/logging";

const NAMESPACE = "pages";

const dir = (file: string) => {
  return path.join(config.rootDir + "/public/" + file);
};

export const home = (req: Request, res: Response) => {
  res.sendFile(dir("index.html"))
};

export const chat = (req: Request, res: Response) => {
  if (!auth(req.cookies.auth)) return res.redirect("/login");
  res.sendFile(dir("chat.html"));
};

export const login = (req: Request, res: Response) => {
  res.sendFile(dir("login.html"));
};

export const register = (req: Request, res: Response) => {
  res.sendFile(dir("register.html"));
};
