import logging from "../config/logging";
import { Request, Response, NextFunction } from "express";

const NAMESPACE = "middleware";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  let ignore = /[(\.css)(\.js)(\.png)(\.ico)]/.test(req.url);
  if (!ignore) logging.info(NAMESPACE, `${req.method} '${req.url}'`);

  res.on("finish", () => {
    if (!ignore)
      logging.info(
        NAMESPACE,
        `${req.method} '${req.url}' -> ${res.statusCode} ${res.statusMessage} | ${req.socket.remoteAddress}`
      );
  });

  next();
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: "Not Found",
  });
}
