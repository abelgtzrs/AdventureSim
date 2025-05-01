import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async ({ req }: { req: Request }) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {};
  }

  const token = authHeader.split("Bearer ")[1].trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return { user: decoded };
  } catch (err) {
    console.warn("[AUTH] Invalid or expired token");
    return {};
  }
};
export function signToken({ _id, email, username }: any) {
  return jwt.sign({ _id, email, username }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });
}
