import { Request, Response } from "express";
import { query } from "../helpers/db";

type authInfo = {
  username: string,
  password: string
}

/**
 * The handler for user registration.
 * 
 * { username: string, password: string }
 */
export const register = (req: Request, res: Response) => {
  /*  Input validation */
  if (!req.body) return res.status(400).json({ message: "missing request body" });
  if (!req.body.username?.length) return res.status(400).json({ message: "Invalid Username" });
  if (!req.body.password?.length) return res.status(400).json({ message: "Invalid Password" });
  const { username, password } : authInfo = req.body;

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
  const { username, password } : authInfo = req.body;
};
