import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";

interface ValidationErrorItem {
  field: string;
  message: string;
  type: string;
}

function mongooseValidationErrorMiddleware(
  err: Error.ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === "ValidationError") {
    const errors: ValidationErrorItem[] = Object.values(err.errors).map(
      (e) => ({
        field: e.path,
        message: e.message,
        type: e.kind,
      })
    );
    return res.status(400).json({ errors });
  }
  next(err);
}

export default mongooseValidationErrorMiddleware;
