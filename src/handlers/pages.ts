import { Request, Response } from "express";
import { auth } from "./auth/helpers";
import logging from "../config/logging";
import { dir } from "../helpers/misc";

const NAMESPACE = "pages";

export const home = async (req: Request, res: Response) => {
  res.redirect("/chat");
};


export const login = (req: Request, res: Response) => {
  res.sendFile(dir("login.html"));
};

export const register = (req: Request, res: Response) => {
  res.sendFile(dir("register.html"));
};
