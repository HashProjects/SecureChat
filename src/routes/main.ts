import { chat, home, login, register } from "../handlers/pages";
import express, { Router, Request, Response, NextFunction } from "express";
import logging from "../config/logging";

const NAMESPACE = "main"

const router = Router();
router.use((req: Request, res: Response, next: NextFunction) => {
  logging.debug(NAMESPACE, "Routed to main");
  next();
});

router.get("/", home);
router.get("/chat", chat);
router.get("/login", login);
router.get("/register", register);

export default router;
