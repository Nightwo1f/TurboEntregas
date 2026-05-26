export type Plan = "FREE" | "VIP";
export type BatchStatus = "OPEN" | "PROCESSING" | "DONE" | "CANCELLED";

export type UserDocument = {
  name: string;
  email: string;
  emailLower: string;
  passwordHash: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
};

export type PhotoBatchDocument = {
  userId: string;
  status: BatchStatus;
  maxPhotos: number;
  createdAt: string;
  updatedAt: string;
};

export type PhotoDocument = {
  batchId: string;
  userId: string;
  imageUrl: string;
  ocrText?: string;
  extractedAddress?: string;
  createdAt: string;
};

export type AddressDocument = {
  batchId: string;
  photoId: string;
  userId: string;
  rawText: string;
  address: string;
  latitude: number;
  longitude: number;
  isConfirmed: boolean;
  orderIndex?: number;
  createdAt: string;
};

export type RoutePlanDocument = {
  userId: string;
  batchId: string;
  originLatitude: number;
  originLongitude: number;
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  createdAt: string;
};

export function withId<T extends object>(id: string, data: T) {
  return { id, ...data };
}
