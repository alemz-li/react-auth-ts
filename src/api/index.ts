import express from "express";
import MessageResponse from "../types/MessageResponse";

import auth from "./auth/auth.routes";

import { deserializeUser } from "./middlewares/deserializeUser";

const router = express.Router();

router.get<Record<string, never>, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);

router.get("/data", deserializeUser, (_req, res) => {
  res.json({ foo: "bar" });
});

export default router;
