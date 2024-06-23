import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

export const verifyRefreshToken = (
  token: string
): Promise<{ userId: string }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshTokenSecret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as { userId: string });
    });
  });
};
