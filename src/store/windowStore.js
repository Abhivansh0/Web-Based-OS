import { create } from 'zustand'

let globalZIndex = 1

export const useWindowStore = create((set, get) => ({
    windows: [],

    addWindow: (windowsData) => {
        const newWindow = {
            id: windowsData.pid,
            name: windowsData.ProcessName,
            cpuUsage: windowsData.cpuUsage,
            memoryUsage: windowsData.memoryUsage,
            size: { width: 800, height: 500 },
            position: { x: 100, y: 100 },
            zIndex: globalZIndex++,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
        }
        set((state) => ({
            windows: [...state.windows.map(win => ({ ...win, isFocused: false })), newWindow]
        }))
    },

    closeWindow: (pid) => {
        set((state) => ({
            windows: state.windows.filter((win) => win.id !== pid)
        }))
    },

    focusWindows: (id) => set((state) => {
        const windows = [...state.windows];
        const index = windows.findIndex(win => win.id === id);
        if (index === -1) return { windows };

        const focusedWin = windows.splice(index, 1)[0];
        focusedWin.isFocused = true;
        windows.forEach(win => win.isFocused = false);
        windows.push(focusedWin);

        return {
            windows: windows.map((win, i) => ({
                ...win,
                zIndex: i + 1
            }))
        };
    }),


    minimizeWindow: (id) => set((state) => {
        const updatedWindows = state.windows.map((win) => {
            if (win.id === id) {
                return {
                    ...win,
                    isMinimized: true,
                    isFocused: false
                }
            }
            return win
        })
        return { windows: updatedWindows }
    }),

    maximizeWindow: (id) => set((state) => {
        const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0)
        const updatedWindows = state.windows.map((win) => {
            if (win.id === id) {
                const shouldUpdate = win.zIndex < maxZ
                return {
                    ...win,
                    isFocused: true,
                    isMaximized: !win.isMaximized,
                    zIndex: shouldUpdate ? globalZIndex++ : win.zIndex,
                }
            }
            return {
                ...win,
                isFocused: false
            }
        })
        return { windows: updatedWindows }
    }),

    restoreMinimize: (id) => set((state) => {
        const maxZ = Math.max(...state.windows.map(c => c.zIndex), 0)
        const updatedWindows = state.windows.map((win) => {
            const shouldUpdate = win.zIndex < maxZ
            if (win.id === id && win.isMinimized) {
                return {
                    ...win,
                    isMinimized: false,
                    isFocused: true,
                    zIndex: shouldUpdate ? globalZIndex++ : win.zIndex
                }
            }
            return {
                ...win,
                isFocused: false
            }
        })
        return { windows: updatedWindows }
    }),

    moveWindow: (id, newPosition) => {
        set((state) => ({
            windows: state.windows.map((win) =>
                win.id === id ? {
                    ...win,
                    position: newPosition
                } : win
            )
        }))
    },

    resizeWindow: (id, newSize) => {
        set((state) => ({
            windows: state.windows.map((win) =>
                win.id === id ? { ...win, size: newSize } : win
            )
        }))
    },

    bringToFront: (id) => set((state) => {
        const windows = [...state.windows];
        const index = windows.findIndex(win => win.id === id);
        if (index === -1) return { windows };

        const targetWin = windows.splice(index, 1)[0];
        targetWin.isFocused = true;
        windows.forEach(win => win.isFocused = false);
        windows.push(targetWin);

        return {
            windows: windows.map((win, i) => ({
                ...win,
                zIndex: i + 1
            }))
        };
    }),



}

))