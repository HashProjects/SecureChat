import { Request, Response } from "express";
import logging from "../config/logging";
import { query } from "../helpers/db";
import User from "../models/User";
import bcrypt from "bcrypt";

const NAMESPACE = "auth";

const SALT_ROUNDS = 10;

type authInfo = {
  username: string;
  password: string;
};

/**
 * The handler for user registration.
 *
 * { username: string, password: string }
 */
export const register = async (req: Request, res: Response) => {
  /*  Input validation */
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid Username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid Password" });
  const { username, password }: authInfo = req.body;

  const user = new User(username);

  const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);

  logging.debug(NAMESPACE, `${user.name}, ${user.id}, ${hashedPassword}`);

  await query("INSERT INTO Users (username, id, password) VALUES (?, ?, ?)", [
    user.name,
    user.id,
    hashedPassword,
  ]).catch((err: Error) => {
    logging.error(NAMESPACE, err.toString());
    return res.status(406).json({
      message: "This username has already been taken",
    });
  });
};

/**
 * The handler for user login
 *
 * { username: string, password: string }
 */
export const login = (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid Username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid Password" });
  const { username, password }: authInfo = req.body;
};
