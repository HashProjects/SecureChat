import { Request, Response } from "express";
import { query } from "../helpers/db";

export const register = (req: Request, res: Response) => {
  res.send("Register");
};

export const login = (req: Request, res: Response) => {
  res.send("Login");
};
