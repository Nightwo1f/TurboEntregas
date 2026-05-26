import { create } from "zustand";
import type { LocalPhoto } from "../services/photoService";

type BatchState = {
  photos: LocalPhoto[];
  addPhoto: (photo: LocalPhoto, limit: number) => boolean;
  removePhoto: (id: string) => void;
  clear: () => void;
};

export const useBatchStore = create<BatchState>((set, get) => ({
  photos: [],
  addPhoto: (photo, limit) => {
    if (get().photos.length >= limit) {
      return false;
    }

    set((state) => ({ photos: [...state.photos, photo] }));
    return true;
  },
  removePhoto: (id) =>
    set((state) => ({
      photos: state.photos.filter((photo) => photo.id !== id)
    })),
  clear: () => set({ photos: [] })
}));
