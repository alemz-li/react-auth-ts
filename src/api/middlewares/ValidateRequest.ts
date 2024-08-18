import { NextFunction, Request, Response } from "express";
import RequestValidator from "../../types/RequestValidator";
import { ZodError } from "zod";

export const validateRequest = (validators: RequestValidator) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(422);
      }
      next(error);
    }
  };
};
