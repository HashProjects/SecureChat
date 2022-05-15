import { NextFunction, Request, Response } from "express";
import logging from "../../config/logging";
import { query } from "../../helpers/db";
import User from "../../models/User";
import bcrypt from "bcrypt";
import config from "../../config/config";
import { auth, parseAuth, sign } from "./helpers";
import UserRequest from "../../models/UserRequest";

const NAMESPACE = "httpAuth";

const COOKIE_OPTIONS = {
  maxAge: 1000 * config.auth.expire,
};

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
  if (!Object.keys(req.body).length)
    return res.status(400).json({ message: "Missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid password" });
  const { username, password }: authInfo = req.body;

  /* Generate user object and uuidv4 */
  const user = new User(username);

  /* Hash and Salt Password */
  const hashedPassword = bcrypt.hashSync(password, config.auth.saltRounds);

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

  res.cookie("auth", authCode, COOKIE_OPTIONS);

  res.status(200).json({
    message: "Successfully registered",
    auth: authCode,
    username: user.name,
    userId: user.id,
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

  res.cookie("auth", authCode, COOKIE_OPTIONS);

  res.status(200).json({
    message: "Successfully logged in",
    auth: authCode,
    username: user.name,
    userId: user.id,
  });
};

/**
 * Logs out the user. Updates the jwtVersion in the DB to invalidate all old JWTs
 */
export const logout = async (req: UserRequest, res: Response) => {
  await query("UPDATE Users SET version = version + 1 WHERE id = ?", [req.body.id]).catch((e) => {
    logging.error(NAMESPACE, "Database Error", e);
    res.status(500).json({
      message: "Database Error",
      error: e,
    });
  });

  if (res.headersSent) return;

  res.clearCookie("auth");

  res.status(200).json({
    message: "Logged out",
  });
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const user = await auth(parseAuth(req));
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  (req as UserRequest).user = user;
  next();
};

export const authenticatePage = async (req: Request, res: Response, next: NextFunction) => {
  const user = await auth(parseAuth(req));
  if (!user) return res.clearCookie("auth").redirect("/login");
  (req as UserRequest).user = user;
  next();
};
