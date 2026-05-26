import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { db } from "../../firebase/admin.js";
import type { AddressDocument, RoutePlanDocument } from "../../firebase/types.js";
import { withId } from "../../firebase/types.js";

export const routesRouter = Router();

routesRouter.use(requireAuth);

routesRouter.post("/plan", async (req: AuthenticatedRequest, res) => {
  const body = z
    .object({
      batchId: z.string(),
      originLatitude: z.number(),
      originLongitude: z.number()
    })
    .safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Dados invalidos.", issues: body.error.issues });
  }

  const addressesSnapshot = await db
    .collection("addresses")
    .where("batchId", "==", body.data.batchId)
    .where("userId", "==", req.user!.id)
    .where("isConfirmed", "==", true)
    .orderBy("createdAt", "asc")
    .get();
  const addresses = addressesSnapshot.docs.map((addressDoc) =>
    withId(addressDoc.id, addressDoc.data() as AddressDocument)
  );

  const routePlanRef = db.collection("routePlans").doc();
  const routePlan: RoutePlanDocument = {
    userId: req.user!.id,
    batchId: body.data.batchId,
    originLatitude: body.data.originLatitude,
    originLongitude: body.data.originLongitude,
    totalDistanceMeters: 0,
    totalDurationSeconds: 0,
    createdAt: new Date().toISOString()
  };

  await routePlanRef.set(routePlan);

  return res.status(201).json({
    routePlan: withId(routePlanRef.id, routePlan),
    stops: addresses.map((address, index) => ({
      ...address,
      orderIndex: index
    })),
    message: "Otimizacao via Google Routes API pendente."
  });
});

routesRouter.get("/:id", async (req: AuthenticatedRequest, res) => {
  const routeDoc = await db.collection("routePlans").doc(req.params.id).get();
  const route = routeDoc.data() as RoutePlanDocument | undefined;

  if (!routeDoc.exists || !route || route.userId !== req.user!.id) {
    return res.status(404).json({ message: "Rota nao encontrada." });
  }

  return res.json(withId(routeDoc.id, route));
});
