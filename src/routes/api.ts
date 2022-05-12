import { login, register } from "../handlers/auth";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import logging from "../config/logging";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  logging.debug("API Router", "Routed to api");
  next();
});
router.post("/login", login);
router.post("/register", register);

export default router;
