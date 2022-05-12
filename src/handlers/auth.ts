import { Request, Response } from "express";
import logging from "../config/logging";
import { query } from "../helpers/db";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { readFileSync } from "fs";

const NAMESPACE = "auth";

const SALT_ROUNDS = 10;

type authInfo = {
  username: string;
  password: string;
};

/**
 * Warning if Default JWT Key is being used
 */
if (config.jwt.private.includes("default")) {
  logging.warn(
    NAMESPACE,
    "Default JWT Key used. This is unsafe for production. Only use for development. Refer to the README for key generation"
  );
}

const PRIVATE_KEY = readFileSync(config.jwt.private);
const PUBLIC_KEY = readFileSync(config.jwt.public);

/**
 * The handler for user registration.
 *
 * { username: string, password: string }
 */
export const register = async (req: Request, res: Response) => {
  /*  Input validation */
  if (!Object.keys(req.body).length)
    return res.status(400).json({ message: "Missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid password" });
  const { username, password }: authInfo = req.body;

  /* Generate user object and uuidv4 */
  const user = new User(username);

  /* Hash and Salt Password */
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  /* Insert into DB */
  query("INSERT INTO Users (username, id, password) VALUES (?, ?, ?)", [
    user.name,
    user.id,
    hashedPassword,
  ])
    /* If Successful */
    .then(() => {
      res.redirect("/chat");
    })
    /* If Error */
    .catch((err) => {
      /* Duplicate Username */
      if (err.code === "SQLITE_CONSTRAINT") {
        res.status(406).json({
          message: "This username has already been taken",
        });
      } else {
        /* Database failure */
        logging.error(NAMESPACE, err);
        res.status(500).json({
          message: "Database Error",
          error: err,
        });
      }
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
