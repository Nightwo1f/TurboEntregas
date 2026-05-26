import { Router } from "express";
import { z } from "zod";
import { getPlanPhotoLimit } from "../../common/limits.js";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { prisma } from "../../prisma/client.js";

export const batchesRouter = Router();

batchesRouter.use(requireAuth);

batchesRouter.post("/", async (req: AuthenticatedRequest, res) => {
  const maxPhotos = getPlanPhotoLimit(req.user!.plan);
  const batch = await prisma.photoBatch.create({
    data: {
      userId: req.user!.id,
      maxPhotos,
      status: "OPEN"
    }
  });

  return res.status(201).json(batch);
});

batchesRouter.get("/open", async (req: AuthenticatedRequest, res) => {
  const batch = await prisma.photoBatch.findFirst({
    where: {
      userId: req.user!.id,
      status: "OPEN"
    },
    include: { photos: true }
  });

  return res.json(batch);
});

batchesRouter.post("/:id/photos", async (req: AuthenticatedRequest, res) => {
  const body = z.object({ imageUrl: z.string().min(1) }).safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Imagem inválida.", issues: body.error.issues });
  }

  const batch = await prisma.photoBatch.findFirst({
    where: {
      id: req.params.id,
      userId: req.user!.id,
      status: "OPEN"
    },
    include: { photos: true }
  });

  if (!batch) {
    return res.status(404).json({ message: "Lote aberto não encontrado." });
  }

  if (batch.photos.length >= batch.maxPhotos) {
    return res.status(403).json({ message: `Limite de ${batch.maxPhotos} fotos atingido.` });
  }

  const photo = await prisma.photo.create({
    data: {
      batchId: batch.id,
      imageUrl: body.data.imageUrl
    }
  });

  return res.status(201).json(photo);
});

batchesRouter.get("/:id/photos", async (req: AuthenticatedRequest, res) => {
  const batch = await prisma.photoBatch.findFirst({
    where: {
      id: req.params.id,
      userId: req.user!.id
    },
    include: { photos: true }
  });

  if (!batch) {
    return res.status(404).json({ message: "Lote não encontrado." });
  }

  return res.json(batch.photos);
});

batchesRouter.post("/:id/finalize", async (req: AuthenticatedRequest, res) => {
  const batch = await prisma.photoBatch.findFirst({
    where: {
      id: req.params.id,
      userId: req.user!.id,
      status: "OPEN"
    },
    include: { photos: true }
  });

  if (!batch) {
    return res.status(404).json({ message: "Lote aberto não encontrado." });
  }

  const maxPhotos = getPlanPhotoLimit(req.user!.plan);

  if (batch.photos.length > maxPhotos) {
    return res.status(403).json({ message: `Seu plano permite até ${maxPhotos} fotos.` });
  }

  const updatedBatch = await prisma.photoBatch.update({
    where: { id: batch.id },
    data: { status: "PROCESSING" }
  });

  return res.json({
    batch: updatedBatch,
    message: "Lote enviado para OCR. Integração real pendente."
  });
});
