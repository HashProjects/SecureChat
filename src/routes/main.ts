import { chat, home } from "../handlers/pages";
import express, { Router } from "express";
import logging from "../config/logging";
import { Request, Response, NextFunction } from "express";

const router = Router();
router.use(express.static("public"));

router.get("/", home);
router.get("/chat", chat);

export default router;
