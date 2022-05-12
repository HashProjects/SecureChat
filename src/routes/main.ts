import { chat, home, login, register } from "../handlers/pages";
import express, { Router } from "express";

const router = Router();
router.use(express.static("public"));

router.get("/", home);
router.get("/chat", chat);
router.get("/login", login);
router.get("/register", register);

export default router;
