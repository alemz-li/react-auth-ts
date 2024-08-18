import { Router } from "express";
import * as authController from "./auth.controller";
import { validateRequest } from "../middlewares/ValidateRequest";
import {
  ConfirmPasswordSchema,
  ForgotPasswordSchema,
  LoginInputSchema,
  RegisterInputSchema,
} from "./auth.schema";

const router = Router();

router.post(
  "/register",
  validateRequest({
    body: RegisterInputSchema,
  }),
  authController.registerHandler,
);
router.post(
  "/login",
  validateRequest({
    body: LoginInputSchema,
  }),
  authController.loginHandler,
);
router.get("/refresh", authController.refreshTokenHandler);
router.post("/logout", authController.logoutHandler);
router.post(
  "/forgot-password",
  validateRequest({
    body: ForgotPasswordSchema,
  }),
  authController.forgotPasswordHandler,
);
router.patch(
  "/reset-password",
  validateRequest({
    body: ConfirmPasswordSchema,
  }),
  authController.resetPasswordHandler,
);

export default router;
