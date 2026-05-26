import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { db } from "../../firebase/admin.js";
import type { UserDocument } from "../../firebase/types.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userDoc = await db.collection("users").doc(req.user!.id).get();

  if (!userDoc.exists) {
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }

  const user = userDoc.data() as UserDocument;

  return res.json({
    id: userDoc.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    isVip: user.plan === "VIP",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
});
