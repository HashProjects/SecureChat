import { authenticate, login, logout, register } from "../handlers/auth/http";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import logging from "../config/logging";
import { createRoom, roomUsers } from "../handlers/rooms";

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
router.post("/roomusers", roomUsers as (req: Request, res: Response) => Promise<void>);
// router.post("/deleteRoom", logout as (req: Request, res: Response) => Promise<void>);

export default router;
