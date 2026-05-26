import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { prisma } from "../../prisma/client.js";

export const subscriptionsRouter = Router();

subscriptionsRouter.use(requireAuth);

subscriptionsRouter.get("/status", async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { plan: true }
  });

  return res.json({
    plan: user?.plan ?? "FREE",
    isVip: user?.plan === "VIP"
  });
});

subscriptionsRouter.post("/mock-vip", async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { plan: "VIP" },
    select: { id: true, plan: true }
  });

  return res.json({ ...user, isVip: true });
});
