import { NextFunction, Request, Response } from "express";
import config from "config";
import * as UserService from "../users/users.service";
import { LoginBodyType, RegisterBodyType } from "./auth.schema";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { hashPassword, validatePassword } from "../../lib/bcrypt";
import { signJwt, verifyJwt } from "../../lib/jwt";
import { UserPayload } from "../middlewares/deserializeUser";

export const registerHandler = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterBodyType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;

    const isRegistered = await UserService.isRegistered({ username, email });
    if (isRegistered) {
      res.status(400);
      throw new Error("Please provide another username or password");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await UserService.registerUser({
      email,
      username,
      password: hashedPassword,
    });

    const tokenPayload = {
      username: newUser.username,
      email: newUser.email,
    };

    const accessToken = signJwt(tokenPayload, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    const refreshToken = signJwt(tokenPayload, "refreshTokenPrivateKey", {
      expiresIn: `${config.get<number>("refreshTokenExpiresIn")} days`,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });
    res.json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginHandler = async (
  req: Request<Record<string, never>, Record<string, never>, LoginBodyType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserService.findUserByUsername(req.body.username);

    if (!user) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await validatePassword(
      req.body.password,
      user.password,
    );

    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const tokenPayload = {
      username: user.username,
      email: user.email,
    };

    const accessToken = signJwt(tokenPayload, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    const refreshToken = signJwt(tokenPayload, "refreshTokenPrivateKey", {
      expiresIn: `${config.get<number>("refreshTokenExpiresIn")} days`,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });

    res.json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const decoded = verifyJwt(
      refreshToken,
      "refreshTokenPrivateKey",
    ) as UserPayload;

    if (!decoded) {
      return res.sendStatus(403);
    }

    const payload = {
      username: decoded.username,
      email: decoded.email,
    };

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  const { jwt } = req.cookies;

  if (!jwt) return res.sendStatus(204);

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.sendStatus(204);
};

export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const user = await UserService.findUserByEmail(email);

    if (!user) {
      return res.sendStatus(200);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash reset token for extra security measure
    // const passwordResetToken = crypto
    //   .createHash("sha256")
    //   .update(resetToken)
    //   .digest("hex");

    const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

    const origin = "http://localhost:5173";
    const link = `${origin}/reset-password?token=${resetToken}`;

    await UserService.createPasswordResetToken({
      userId: user.id,
      token: resetToken,
      expiresAt,
    });

    console.log(link);

    res.status(200).json({
      link,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resetPasswordHandler = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    { password: string },
    { token: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token) return res.sendStatus(401);

    const passwordReset = await UserService.findResetPassword(token);

    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      res.status(400);
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await hashPassword(password);

    await UserService.updateResetPassword(passwordReset.userId, hashedPassword);

    await UserService.deletePasswordToken(passwordReset.id);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
