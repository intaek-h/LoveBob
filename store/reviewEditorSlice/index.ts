import { StateCreator } from "zustand";
import { Store } from "..";

export interface ReviewEditorSlice {
  title: string;
  body: string;
  images: ImageObject[];
  updateTitle: (title: string) => void;
  updateImages: (images: ImageObject) => void;
  emptyImages: () => void;
  deleteImage: (index: number) => void;
  updateBody: (body: string) => void;
}

export interface ImageObject {
  dataUrl: string;
  url: string;
}

export const createReviewEditorSlice: StateCreator<Store, [], [], ReviewEditorSlice> = (set) => ({
  title: "",
  body: "",
  images: [],
  updateTitle: (title) => set(() => ({ title })),
  updateImages: (image) => set((state) => ({ images: [...state.images, image] })),
  emptyImages: () => set(() => ({ images: [] })),
  updateBody: (body) => set((state) => ({ body })),
  deleteImage: (index) =>
    set((state) => {
      const prev = state.images.slice();
      prev.splice(index, 1);
      return { images: prev };
    }),
});
