import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  username: string;
  email: string;
}

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401);
      throw new Error("No token provided");
    }

    const decoded = verifyJwt(token, "accessTokenPrivateKey") as UserPayload;

    if (!decoded) {
      res.status(403);
      throw new Error("Invalid token");
    }

    res.locals.user = {
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
