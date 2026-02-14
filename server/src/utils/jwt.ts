import jwt from "jsonwebtoken";
import { config } from "../config/env";

export type JwtRole = "admin" | "user";

export interface JwtPayload {
  userId: number;
  email: string;
  role: JwtRole;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
