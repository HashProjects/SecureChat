import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import { query } from "../helpers/db";
import { dir } from "../helpers/misc";
import ChatRoom from "../models/ChatRoom";

const NAMESPACE = "Chat Handler";

export const room = async (req: Request, res: Response, next: NextFunction) => {
  const room_id = req.params.id;
  const rooms = await query("SELECT * FROM ChatRoom WHERE id = ?", [room_id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  if (!rooms || !rooms[0]) return next();
  const room: ChatRoom = rooms[0];

  res.sendFile(dir("room.html"));
};

export const chat = (req: Request, res: Response) => {
  res.sendFile(dir("chat.html"));
};
