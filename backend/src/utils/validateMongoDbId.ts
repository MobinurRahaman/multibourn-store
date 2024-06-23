import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const validateMongoDbId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    res.status(400);
    throw new Error("This id is not valid or not Found");
  }
  next();
};

export { validateMongoDbId };
