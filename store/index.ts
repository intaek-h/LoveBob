import create from "zustand";
import { createReviewEditorSlice, ReviewEditorSlice } from "./reviewEditorSlice";

export type Store = ReviewEditorSlice;

export const useBoundStore = create<Store>()((...a) => ({
  ...createReviewEditorSlice(...a),
}));
