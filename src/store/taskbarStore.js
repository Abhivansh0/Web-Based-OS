import { create } from 'zustand';

export const useTaskbarStore = create((set) => ({
  apps: [], // List of currently open apps

  // Add a new app if it's not already in the list
  addApp: (app) =>
    set((state) => {
      if (state.apps.find((a) => a.id === app.id)) return state;
      return {
        apps: [...state.apps, { ...app, minimized: false, focused: false, isPinned: false }],
      };
    }),

  // Remove an app by ID
  removeApp: (id) =>
    set((state) => ({
      apps: state.apps.filter((app) => app.id !== id),
    })),

  // Toggle minimized state
  toggleMinimize: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, minimized: !app.minimized } : app
      ),
    })),

  // Set focus to a specific app
  setFocus: (id) =>
    set((state) => ({
      apps: state.apps.map((app) => ({
        ...app,
        focused: app.id === id,
      })),
    })),

  // Toggle pin state
  togglePin: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, isPinned: !app.isPinned } : app
      ),
    })),

  // Handle click on taskbar icon (minimize if focused, restore if minimized, or focus)
  handleAppClick: (id) =>
    set((state) => {
      const apps = [...state.apps];
      const app = apps.find((a) => a.id === id);
      if (!app) return { apps };

      if (app.focused) {
        app.minimized = true;
        app.focused = false;
      } else if (app.minimized) {
        app.minimized = false;
        apps.forEach((a) => (a.focused = a.id === id));
      } else {
        apps.forEach((a) => (a.focused = a.id === id));
      }

      return { apps };
    }),
}));
