import { Request, Response } from "express";
import logging from "../config/logging";
import { query } from "../helpers/db";
import ChatRoom from "../models/ChatRoom";
import User from "../models/User";

const NAMESPACE = "user handler";

export const user = async (req: Request, res: Response) => {
  const user_id = req.params.id;
  if (!user_id) return res.status(400).json({ message: "Invalid Room id" });

  const user = new User("", "", "", user_id);

  const users = await query("SELECT name FROM Users WHERE id = ?", [user.id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  if (!users) return res.status(400).json({ message: "User not found" });
  user.name = users[0].name;

  logging.debug(NAMESPACE, "userQuery", users);

  const roomsQuery = await query(
    "SELECT * FROM ChatRoom JOIN ChatRoomUsers ON ChatRoom.id = ChatRoomUsers.room_id WHERE ChatRoomUsers.user_id = ?",
    [user.id]
  ).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  logging.debug(NAMESPACE, "roomsQuery", roomsQuery);

  if (!roomsQuery) return res.status(400).json({ message: "User not found" });
  const rooms: ChatRoom[] = roomsQuery;

  res.status(201).json({
    message: "Found user",
    user: user,
    rooms: rooms,
  });
};
