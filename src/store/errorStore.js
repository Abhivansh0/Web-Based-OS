// store/errorStore.js
import { create } from "zustand";

const useErrorStore = create((set) => ({
  errors: [], // each error = { type, message }

  addError: (type, message) =>
    set((state) => ({
      errors: [...state.errors, { type, message }]
    })),

  clearErrors: () => set({ errors: [] })
}));

export default useErrorStore;
