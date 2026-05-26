import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { prisma } from "../../prisma/client.js";

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
    return res.status(400).json({ message: "Dados inválidos.", issues: body.error.issues });
  }

  const addresses = await prisma.address.findMany({
    where: {
      batchId: body.data.batchId,
      isConfirmed: true
    },
    orderBy: { createdAt: "asc" }
  });

  const routePlan = await prisma.routePlan.create({
    data: {
      userId: req.user!.id,
      batchId: body.data.batchId,
      originLatitude: body.data.originLatitude,
      originLongitude: body.data.originLongitude,
      totalDistanceMeters: 0,
      totalDurationSeconds: 0
    }
  });

  return res.status(201).json({
    routePlan,
    stops: addresses.map((address: (typeof addresses)[number], index: number) => ({
      ...address,
      orderIndex: index
    })),
    message: "Otimização via Google Routes API pendente."
  });
});

routesRouter.get("/:id", async (req: AuthenticatedRequest, res) => {
  const route = await prisma.routePlan.findFirst({
    where: {
      id: req.params.id,
      userId: req.user!.id
    }
  });

  if (!route) {
    return res.status(404).json({ message: "Rota não encontrada." });
  }

  return res.json(route);
});
