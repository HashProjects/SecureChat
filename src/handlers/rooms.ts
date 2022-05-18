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
  const room = new ChatRoom(users, req.body.name);

  await query("INSERT INTO ChatRoom (id, name, key) VALUES (?, ?, ?)", [room.id, room.name, room.key]).catch((e) => {
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

  logging.debug(NAMESPACE, "room", room);

  res.status(201).json({
    message: "Succesfully Created Room",
    room: room,
  });
};

export const room = async (req: Request, res: Response) => {
  const room_id = req.params.id;
  if (!room_id) return res.status(400).json({ message: "Invalid Room id" });

  const users = await query(
    "SELECT name, id FROM Users JOIN ChatRoomUsers ON ChatRoomUsers.user_id=Users.id WHERE room_id = ?",
    [room_id]
  ).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });
  if (res.headersSent) return;

  if (!users) return res.status(400).json({ message: "Room not found" });

  const room: ChatRoom = new ChatRoom(users, room_id);

  res.status(201).json({
    message: "Found room",
    room: room,
  });
};
