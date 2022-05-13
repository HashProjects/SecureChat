import { Request, Response } from "express";
import logging from "../config/logging";
import { query } from "../helpers/db";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt, { Algorithm, JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { readFileSync } from "fs";

const NAMESPACE = "auth";
const SALT_ROUNDS = 10;

/* Read JWT keys from files */
const PRIVATE_KEY = readFileSync(config.jwt.private);
const PUBLIC_KEY = readFileSync(config.jwt.public);

const EXPIRATION = 60 * 60; // 1 hour

const COOKIE_OPTIONS = {
  maxAge: 1000 * EXPIRATION,
};

/**
 * The Signing options for the JWT tokens
 */
const JWT_OPTIONS = {
  expiresIn: EXPIRATION,
  algorithm: "RS256" as Algorithm,
};

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

/**
 * Attempts to authenticate the provided jwt token
 * @param {string} token - The JWT token
 */
export const auth = async (token: string) => {
  if (!token) return;

  const data = verify(token);
  if (!data) return false;

  const version = await getVersion(data.id);

  if (version === false || data.version !== version) return false;

  return data;
};

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
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

  /* Insert into DB */
  await query("INSERT INTO Users (username, id, password, version) VALUES (?, ?, ?, 0)", [
    user.name,
    user.id,
    hashedPassword,
  ]).catch((err) => {
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

  if (res.headersSent) return;

  /* Query Successful */

  /* Sign JWT */
  const authCode = sign(user, 0);

  logging.debug(NAMESPACE, "Generated JWT Token", authCode);

  /* Set Cookie */
  res.cookie("auth", authCode, COOKIE_OPTIONS);
  res.cookie("username", user.name, COOKIE_OPTIONS);
  res.cookie("id", user.id, COOKIE_OPTIONS);

  res.status(200).json({
    message: "Successfully registered",
  });
};

/**
 * The handler for user login
 *
 * { username: string, password: string }
 */
export const login = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid Username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid Password" });
  const { username, password }: authInfo = req.body;

  /* Fetch hashedPassword from DB */
  const rows = await query("SELECT password, id, version FROM Users WHERE username = ?", [
    username,
  ]).catch((err) => {
    /* Database failure */
    logging.error(NAMESPACE, err);
    res.status(500).json({
      message: "Database Error",
      error: err,
    });
  });

  if (res.headersSent) return;

  if (!rows?.length || !rows[0].id || !rows[0].password) {
    logging.debug(NAMESPACE, "Username does not exist");
    return res.status(400).json({
      message: "Username or password incorrect",
    });
  }

  /* Query Successful */
  const hashedPassword: string = rows[0].password;
  const id: string = rows[0].id;
  const version: number = rows[0].version;
  const user = new User(username, id);

  /* Check Hashes */
  if (!bcrypt.compareSync(password, hashedPassword)) {
    logging.debug(NAMESPACE, "Password Incorrect");
    return res.status(400).json({
      message: "Username or password incorrect",
    });
  }

  /* Sign JWT */
  const authCode = sign(user, version);

  logging.debug(NAMESPACE, "Generated JWT Token", authCode);

  /* Set Cookie */
  res.cookie("auth", authCode, COOKIE_OPTIONS);
  res.cookie("username", user.name, COOKIE_OPTIONS);
  res.cookie("id", user.id, COOKIE_OPTIONS);

  res.status(200).json({
    message: "Successfully logged in",
  });
};

/**
 * Logs out the user. Updates the jwtVersion in the DB to invalidate all old JWTs
 */
export const logout = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.id) return res.status(400).json({ message: "Invalid User ID" });

  await query("UPDATE Users SET version = version + 1 WHERE id = ?", [req.body.id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });

  if (res.headersSent) return;

  res.clearCookie("auth");
  res.clearCookie("username");
  res.clearCookie("id");
  res.status(200).json({
    message: "Logged out",
  });
};

/**
 * The JWT version of the user, for token invalidation
 * @param {string} id - the id of the user
 * @returns the verison of users jwt token
 */
const getVersion = async (id: string): Promise<number | false> => {
  const rows = await query("SELECT version FROM Users WHERE id = ?", [id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
  });

  if (!rows?.length || rows[0].version === undefined) {
    logging.error(NAMESPACE, "User token version not found");
    return false;
  }

  return rows[0].version;
};

/**
 * Verifies the JWT token and returns its data.
 * @param {string} token - the JWT token
 */
const verify = (token: string): JwtPayload | false => {
  try {
    const data = jwt.verify(token, PUBLIC_KEY) as JwtPayload;

    logging.debug("authenticate", "verify successful", data);

    return data;
  } catch (e) {
    logging.debug(NAMESPACE, "jwt.verify error", e);
  }

  return false;
};

/**
 * @param {User} user
 * @param {number} version
 * @returns the signed JWT token
 */
const sign = (user: User, version: number): string => {
  return jwt.sign(
    { username: user.name, id: user.id, version: Math.floor(version) },
    PRIVATE_KEY,
    JWT_OPTIONS
  );
};
