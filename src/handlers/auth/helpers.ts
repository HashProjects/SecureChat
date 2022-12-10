import logging from "../../config/logging";
import { query } from "../../helpers/db";
import User from "../../models/User";
import jwt, { Algorithm, JwtPayload } from "jsonwebtoken";
import config from "../../config/config";
import { readFileSync } from "fs";
import { Request } from "express";

const NAMESPACE = "Auth Helpers";

/**
 * The Signing options for the JWT tokens
 */
const JWT_OPTIONS = {
  expiresIn: config.auth.expire,
  algorithm: "RS256" as Algorithm,
};

/* Read JWT keys from files */
export const PRIVATE_KEY = readFileSync(config.auth.jwt.private);
export const PUBLIC_KEY = readFileSync(config.auth.jwt.public);

/* Read DSA keys from files */
export const DSA_PRIVATE_KEY = readFileSync(config.dsa.private);
export const DSA_PUBLIC_KEY = readFileSync(config.dsa.public);
/**
 * Warning if Default JWT Key is being used
 */
if (config.auth.jwt.private.includes("default")) {
  logging.warn(
    NAMESPACE,
    "Default JWT Key used. This is unsafe for production. Only use for development. Refer to the README for key generation"
  );
}

/**
 * Attempts to authenticate the provided jwt token
 * @param {string} token - The JWT token
 */
export const auth = async (token: string | null): Promise<User | null> => {
  if (!token) return null;

  const data = verify(token);
  if (!data) return null;

  const version = await getVersion(data.id);

  if (version === false || data.version !== version) return null;

  // TODO: will this cause a problem?
  const user = new User(data.username, "", "", data.id);
  return user;
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
export const verify = (token: string): JwtPayload | null => {
  try {
    const data = jwt.verify(token, PUBLIC_KEY) as JwtPayload;

    logging.debug("authenticate", "verify successful", data);

    return data;
  } catch (e) {
    logging.debug(NAMESPACE, "jwt.verify error", e);
  }

  return null;
};

/**
 * @param {User} user
 * @param {number} version
 * @returns the signed JWT token
 */
export const sign = (user: User, version: number): string => {
  return jwt.sign(
    { username: user.name, id: user.id, version: Math.floor(version) },
    PRIVATE_KEY,
    JWT_OPTIONS
  );
};

export const parseAuth = (req: Request) => {
  const authCode = req.header("Authentication")?.split(" ")[1] || req.cookies.auth;
  return authCode;
};
