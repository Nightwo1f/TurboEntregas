import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../common/asyncHandler.js";
import { requireAuth, type AuthenticatedRequest } from "../../common/auth.js";
import { getPlanPhotoLimit } from "../../common/limits.js";
import { db } from "../../firebase/admin.js";
import type { PhotoBatchDocument, PhotoDocument, UserDocument } from "../../firebase/types.js";
import { withId } from "../../firebase/types.js";

export const batchesRouter = Router();

batchesRouter.use(requireAuth);

batchesRouter.post("/", asyncHandler(async (req: AuthenticatedRequest, res) => {
  const plan = await getCurrentUserPlan(req.user!.id);
  const maxPhotos = getPlanPhotoLimit(plan);
  const now = new Date().toISOString();
  const batchRef = db.collection("photoBatches").doc();
  const batch: PhotoBatchDocument = {
    userId: req.user!.id,
    maxPhotos,
    status: "OPEN",
    createdAt: now,
    updatedAt: now
  };

  await batchRef.set(batch);

  return res.status(201).json(withId(batchRef.id, batch));
}));

batchesRouter.get("/open", asyncHandler(async (req: AuthenticatedRequest, res) => {
  const batchSnapshot = await db
    .collection("photoBatches")
    .where("userId", "==", req.user!.id)
    .where("status", "==", "OPEN")
    .limit(1)
    .get();
  const batchDoc = batchSnapshot.docs[0];

  if (!batchDoc) {
    return res.json(null);
  }

  const photos = await getBatchPhotos(batchDoc.id, req.user!.id);

  return res.json({
    id: batchDoc.id,
    ...(batchDoc.data() as PhotoBatchDocument),
    photos
  });
}));

batchesRouter.post("/:id/photos", asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = z.object({ imageUrl: z.string().min(1) }).safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Imagem invalida.", issues: body.error.issues });
  }

  const batchDoc = await db.collection("photoBatches").doc(req.params.id).get();
  const batch = batchDoc.data() as PhotoBatchDocument | undefined;

  if (!batchDoc.exists || !batch || batch.userId !== req.user!.id || batch.status !== "OPEN") {
    return res.status(404).json({ message: "Lote aberto nao encontrado." });
  }

  const photos = await getBatchPhotos(batchDoc.id, req.user!.id);

  if (photos.length >= batch.maxPhotos) {
    return res.status(403).json({ message: `Limite de ${batch.maxPhotos} fotos atingido.` });
  }

  const photoRef = db.collection("photos").doc();
  const photo: PhotoDocument = {
    batchId: batchDoc.id,
    userId: req.user!.id,
    imageUrl: body.data.imageUrl,
    createdAt: new Date().toISOString()
  };

  await photoRef.set(photo);

  return res.status(201).json(withId(photoRef.id, photo));
}));

batchesRouter.get("/:id/photos", asyncHandler(async (req: AuthenticatedRequest, res) => {
  const batchDoc = await db.collection("photoBatches").doc(req.params.id).get();
  const batch = batchDoc.data() as PhotoBatchDocument | undefined;

  if (!batchDoc.exists || !batch || batch.userId !== req.user!.id) {
    return res.status(404).json({ message: "Lote nao encontrado." });
  }

  return res.json(await getBatchPhotos(batchDoc.id, req.user!.id));
}));

batchesRouter.post("/:id/finalize", asyncHandler(async (req: AuthenticatedRequest, res) => {
  const batchRef = db.collection("photoBatches").doc(req.params.id);
  const batchDoc = await batchRef.get();
  const batch = batchDoc.data() as PhotoBatchDocument | undefined;

  if (!batchDoc.exists || !batch || batch.userId !== req.user!.id || batch.status !== "OPEN") {
    return res.status(404).json({ message: "Lote aberto nao encontrado." });
  }

  const plan = await getCurrentUserPlan(req.user!.id);
  const maxPhotos = getPlanPhotoLimit(plan);
  const photos = await getBatchPhotos(batchDoc.id, req.user!.id);

  if (photos.length > maxPhotos) {
    return res.status(403).json({ message: `Seu plano permite ate ${maxPhotos} fotos.` });
  }

  const updatedBatch: PhotoBatchDocument = {
    ...batch,
    status: "PROCESSING",
    updatedAt: new Date().toISOString()
  };

  await batchRef.update({
    status: updatedBatch.status,
    updatedAt: updatedBatch.updatedAt
  });

  return res.json({
    batch: withId(batchDoc.id, updatedBatch),
    message: "Lote enviado para OCR. Integracao real pendente."
  });
}));

async function getBatchPhotos(batchId: string, userId: string) {
  const photosSnapshot = await db
    .collection("photos")
    .where("batchId", "==", batchId)
    .where("userId", "==", userId)
    .orderBy("createdAt", "asc")
    .get();

  return photosSnapshot.docs.map((photoDoc) =>
    withId(photoDoc.id, photoDoc.data() as PhotoDocument)
  );
}

async function getCurrentUserPlan(userId: string) {
  const userDoc = await db.collection("users").doc(userId).get();
  const user = userDoc.data() as UserDocument | undefined;

  return user?.plan ?? "FREE";
}
