import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import path from "path";

const dir = (file: string) => {
  return path.join(config.rootDir + "/public/" + file);
};

export const home = (req: Request, res: Response) => {
  res.sendFile(dir("index.html"));
};

export const chat = (req: Request, res: Response) => {
  res.sendFile(dir("chat.html"));
};
