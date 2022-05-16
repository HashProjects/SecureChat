import { Request, Response } from "express";
import { query } from "../helpers/db";
import ChatRoom from "../models/ChatRoom";
import logging from "../config/logging";
import User from "../models/User";

const NAMESPACE = "Rooms";

export const createRoom = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  logging.debug(NAMESPACE, "body", req.body);
  if (!req.body.users) return res.status(400).json({ message: "Invalid User List" });

  const users: User[] = req.body.users;
  const room = new ChatRoom(users);

  await query("INSERT INTO ChatRoom (id) VALUES (?)", [room.id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  const queryStr = "INSERT INTO ChatRoomUsers (room_id, user_id) VALUES (?, ?)";
  users.forEach(async (user) => {
    await query(queryStr, [room.id, user.id]).catch((e) => {
      logging.error(NAMESPACE, "Database Error", e);
      res.status(500).json({
        message: "Database Error",
        error: e,
      });
    });
  });

  if (res.headersSent) return;

  res.status(201).json({
    message: "Succesfully Created Room",
    room: room,
  });
};

export const roomUsers = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.room) return res.status(400).json({ message: "Invalid Room id" });

  const room = new ChatRoom([], req.body.room);

  const users = await query(
    "SELECT name, id FROM Users JOIN ChatRoomUsers ON ChatRoomUsers.user_id=Users.id WHERE room_id = ?",
    [room.id]
  ).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  if (!users) return res.status(400).json({ message: "Room not found" });

  room.users = users;

  res.status(201).json({
    message: "Found users.",
    users: room.users,
  });
};
