import { create } from 'zustand';

export const useTaskbarStore = create((set, get) => ({
  apps: [],

  terminateApp: (id) =>
    set((state) => ({
      apps: state.apps.filter((app) => app.id !== id),
    })),