// server/utils/auth.ts
import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async ({ req }: { req: Request }) => {
  const authHeader = req.headers["authorization"];
  console.log(
    `[AUTH] Received request. Header: ${
      authHeader ? '"' + authHeader + '"' : "None"
    }`
  ); // Log header presence

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[AUTH] No valid Bearer header found. Returning {}.");
    return {};
  }

  const token = authHeader.split("Bearer ")[1].trim();
  console.log(`[AUTH] Extracted token: ${token ? "Present" : "Missing/Empty"}`);

  // Ensure JWT_SECRET is loaded
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[AUTH] FATAL: JWT_SECRET environment variable is not set!");
    // Throw an error or return indicating failure - preventing verify call
    return {}; // Or throw new Error('JWT_SECRET not set'); - check logs if you throw
  }
  console.log("[AUTH] JWT_SECRET is loaded."); // Confirm secret is available

  try {
    console.log("[AUTH] Attempting jwt.verify...");
    const decoded = jwt.verify(token, secret) as any; // Use the 'secret' variable
    console.log("[AUTH] jwt.verify SUCCESSFUL. Decoded payload:", decoded); // Log the payload
    return { user: decoded };
  } catch (err: any) {
    // Explicitly type 'err'
    // Log the specific error message and type
    console.error(
      `[AUTH] jwt.verify FAILED. Error type: ${err.name}, Message: ${err.message}`
    );
    console.log("[AUTH] Returning {} due to token verification error.");
    return {};
  }
};

// signToken function remains the same...
export function signToken({ _id, email, username }: any) {
  // It's safer to also check for the secret here before signing
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error(
      "[AUTH] FATAL: Cannot sign token, JWT_SECRET environment variable is not set!"
    );
    throw new Error("JWT_SECRET not set, cannot sign token.");
  }
  return jwt.sign({ _id, email, username }, secret, {
    // Use the 'secret' variable
    expiresIn: "2h",
  });
}
