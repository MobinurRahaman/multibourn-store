import { NextFunction, Request, Response } from "express";
import User from "../models/UserModel";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, phone, password } = req.body;
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(401);
      throw new Error("This email is already registered.");
    }
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        res.status(401);
        throw new Error("This phone is already registered.");
      }
    }

    const userData: UserData = { firstname, lastname, email, password };
    if (phone) {
      userData.phone = phone;
    }

    const user = new User(userData);
    await user.save();
    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user._id as string);
    const refreshToken = generateRefreshToken(user._id as string);
    res.json({ status: "success", tokens: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token is required");
  }

  try {
    const { userId } = await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(userId);
    res.json({ status: "success", accessToken: newAccessToken });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(403);
      next({ message: "JWT expired", stack: err.stack });
    } else if (err.name === "JsonWebTokenError") {
      res.status(403);
      next({ message: "Invalid refresh token", stack: err.stack });
    }
    next(err);
  }
};
