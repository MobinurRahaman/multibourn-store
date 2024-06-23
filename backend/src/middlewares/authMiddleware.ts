import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authenticate = passport.authenticate("jwt", { session: false });

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};
