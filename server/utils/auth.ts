import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";

declare module "express" {
  interface Request {
    user?: {
      _id: string;
      email: string;
      username: string;
    };
  }
}

dotenv.config();

const secret = process.env.JWT_SECRET || "supersecret";
const expiration = "2h";

export function signToken({ _id, email, username }: any) {
  return jwt.sign({ _id, email, username }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: Request }) {
  let token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return req;

  try {
    const { _id, email, username } = jwt.verify(token, secret) as any;
    req.user = { _id, email, username };
  } catch (err) {
    console.warn("Invalid token");
  }

  return req;
}
