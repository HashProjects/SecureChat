import { login, register } from "../handlers/auth";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import logging from "../config/logging";

const NAMESPACE = "API Router";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  logging.debug(NAMESPACE, "Routed to api");
  next();
});
router.post("/login", login);
router.post("/register", register);

export default router;
