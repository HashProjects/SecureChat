import { authenticate, login, logout, register } from "../handlers/auth/http";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import logging from "../config/logging";
import { createRoom, room, key } from "../handlers/rooms";
import { user } from "../handlers/user";

const NAMESPACE = "API Router";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  logging.debug(NAMESPACE, "Routed to api");
  next();
});

/* Unauthenticated endpoints */

router.post("/login", login);
router.post("/register", register);

router.use(authenticate);

/* Authenticated endpoints */

router.post("/logout", logout as (req: Request, res: Response) => Promise<void>);
router.post("/createRoom", createRoom as (req: Request, res: Response) => Promise<void>);
router.get("/room/:id", room as (req: Request, res: Response) => Promise<void>);
router.get("/user/:id", user as (req: Request, res: Response) => Promise<void>);
router.post("/key", key as (req: Request, res: Response) => Promise<void>);
// router.post("/deleteRoom", logout as (req: Request, res: Response) => Promise<void>);

export default router;
