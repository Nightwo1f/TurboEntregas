import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    plan: "FREE" | "VIP";
  };
};

export function signToken(payload: { id: string; plan: "FREE" | "VIP" }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    req.user = jwt.verify(token, getJwtSecret()) as AuthenticatedRequest["user"];
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido." });
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return secret;
}
