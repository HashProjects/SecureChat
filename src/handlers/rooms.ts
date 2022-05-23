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

  await query("INSERT INTO ChatRoom (id, name, key, iv) VALUES (?, ?, ?, ?)", [room.id, room.name, room.key, room.iv]).catch((e) => {
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

export const key = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  const room_id = req.body.room_id;
  const user_id = req.body.user_id;
  console.log("room_id = " + room_id);
  if (!room_id) return res.status(400).json({ message: "Invalid Room id" });
  if (!user_id) return res.status(400).json({ message: "Invalid User id" });

  const room = await query(
    "SELECT id, name, key, iv FROM ChatRoom WHERE id = ?",
    [room_id]
  ).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });

  const user = await query(
    "SELECT id, name, publicKey, publicKeyType FROM Users WHERE id = ?",
    [user_id]
  ).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });

  if (res.headersSent) return;

  if (!room) return res.status(400).json({ message: "Room not found" });

  if (!user) return res.status(400).json({ message: "User not found" });

  const key = room[0].key
  const iv = room[0].iv
  // TODO: remove this logging and key and iv from the response
  console.log("user found = " + user[0].id)
  console.log("user key = " + user[0].publicKey)
  console.log(key);
  console.log(iv);

  const userObject: User = new User(user[0].name, user[0].publicKey, user[0].publicKeyType, user[0].id);

  const encryptedKey = userObject.encryptSymmetricKey(key, iv);

  // We need to send the key over the sockets
  res.status(201).json({
    message: "Found key",
    key: key,
    iv: iv,
    encryptedKey: encryptedKey,
  });
};
