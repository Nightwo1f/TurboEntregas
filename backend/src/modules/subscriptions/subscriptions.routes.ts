import { Router } from "express";
import { requireAuth, signToken, type AuthenticatedRequest } from "../../common/auth.js";
import { db } from "../../firebase/admin.js";
import type { UserDocument } from "../../firebase/types.js";

export const subscriptionsRouter = Router();

subscriptionsRouter.use(requireAuth);

subscriptionsRouter.get("/status", async (req: AuthenticatedRequest, res) => {
  const userDoc = await db.collection("users").doc(req.user!.id).get();
  const user = userDoc.data() as UserDocument | undefined;

  return res.json({
    plan: user?.plan ?? "FREE",
    isVip: user?.plan === "VIP"
  });
});

subscriptionsRouter.post("/mock-vip", async (req: AuthenticatedRequest, res) => {
  await db.collection("users").doc(req.user!.id).update({
    plan: "VIP",
    updatedAt: new Date().toISOString()
  });

  return res.json({
    id: req.user!.id,
    plan: "VIP",
    isVip: true,
    token: signToken({ id: req.user!.id, plan: "VIP" })
  });
});
