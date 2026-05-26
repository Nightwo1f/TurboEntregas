import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { prisma } from "../../prisma/client.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  return res.json({ ...user, isVip: user.plan === "VIP" });
});
