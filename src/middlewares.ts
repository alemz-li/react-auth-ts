import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./types/ErrorResponse";
import { ZodError } from "zod";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

 
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const message =
    err instanceof ZodError
      ? err.errors.map((issue) => issue.message)
      : err.message;

  res.json({
    message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
