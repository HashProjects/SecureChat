import { home, login, register } from "../handlers/pages";
import express, { Router, Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import { authenticatePage } from "../handlers/auth/http";
import { chat, room } from "../handlers/chat";

const NAMESPACE = "main";

const router = Router();
router.use((req: Request, res: Response, next: NextFunction) => {
  logging.debug(NAMESPACE, "Routed to main");
  next();
});

/* Unauthenticated Routes */

router.get("/login", login);
router.get("/register", register);

/* Authenticated Routes */

router.use(authenticatePage);

router.get("/", home);
router.get("/chat", chat);
router.get("/chat/:id", room);

export default router;
