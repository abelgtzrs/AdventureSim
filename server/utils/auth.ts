// import jwt from "jsonwebtoken";
// import { Request } from "express";
// import dotenv from "dotenv";

// declare module "express" {
//   interface Request {
//     user?: {
//       _id: string;
//       email: string;
//       username: string;
//     };
//   }
// }

// dotenv.config();

// const secret = process.env.JWT_SECRET || "supersecret";
// const expiration = "2h";

// export function signToken({ _id, email, username }: any) {
//   return jwt.sign({ _id, email, username }, secret, { expiresIn: expiration });
// }

// export function authMiddleware({ req }: { req: Request }) {
//   let token = req.headers.authorization?.split("Bearer ")[1];
//   if (!token) return req;

//   try {
//     const { _id, email, username } = jwt.verify(token, secret) as any;
//     req.user = { _id, email, username };
//   } catch (err) {
//     console.warn("Invalid token");
//   }

//   return req;
// }
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", {
      maxAge: "2hr",
    });
    req.user = data;
  } catch (err) {
    console.log("Invalid token");
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  return jwt.sign({ data: payload }, secretKey, { expiresIn: "2h" });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ["UNAUTHENTICATED"]);
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}
