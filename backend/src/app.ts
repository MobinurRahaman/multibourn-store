import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import authRoutes from "./routes/authRoutes";
import attributeRoutes from "./routes/attributeRoutes";
import "./config/passport";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import mongooseValidationErrorMiddleware from "./middlewares/mongooseValidationErrorMiddleware";

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/attribute", attributeRoutes);

// Use error middlewares
app.use(mongooseValidationErrorMiddleware);
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
