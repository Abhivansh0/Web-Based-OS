import { create } from 'zustand'

function zIndexManager(windows, id) {
    const index = windows.findIndex(win => win.id === id);
    if (index === -1) return windows;

    const target = { ...windows.splice(index, 1)[0], isFocused: true };
    const others = windows.map(w => ({ ...w, isFocused: false }));
    const reordered = [...others, target];

    return reordered.map((win, i) => ({
        ...win,
        zIndex: i + 1
    }));
}


const useWindowStore = create((set, get) => ({
    windows: [],

<<<<<<< HEAD
=======
    bringToFront: (id) => set((state) => {
        const windows = [...state.windows];
        const index = windows.findIndex(win => win.id === id);
        if (index === -1) return { windows };

        const targetWin = {...windows.splice(index, 1)[0], isFocused: true};
        const reordered = windows.map(win=>({...win, isFocused: false}))
        reordered.push(targetWin);

        return {
            windows: reordered.map((win, i) => ({
                ...win,
                zIndex: i + 1
            }))
        };
    }),

>>>>>>> a8012dc298818ace52f68f06c8e28c3f3955af62
    addWindow: (windowsData) => {
        const newWindow = {
            id: windowsData.pid,
            name: windowsData.ProcessName,
            cpuUsage: windowsData.cpuUsage,
            memoryUsage: windowsData.memoryUsage,
            state: windowsData.state,
            size: { width: 800, height: 500 },
            position: { x: 100, y: 100 },
            zIndex: get().windows.length + 1,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,

        }
        set((state) => ({
            windows: [...state.windows.map(win => ({ ...win, isFocused: false })), newWindow]
        }))
    },

    closeWindow: (pid) => {
        set((state) => {
            const filtered = state.windows.filter((win) => win.id !== pid)

            return {
                windows: filtered.map((win, i)=>({
                    ...win,
                    zIndex: i + 1,
                    isFocused: i === filtered.length - 1
                }))
            }
            
        })
    },

<<<<<<< HEAD
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


=======
>>>>>>> a8012dc298818ace52f68f06c8e28c3f3955af62
    minimizeWindow: (id) => set((state) => {
        const index = state.windows.findIndex(win=> win.id === id)
        let nextFocusedWindow = -1
        if (index === -1) return {}
        for (let i = index - 1; i >=0; i--) {
            if (!state.windows[i].isMinimized) {
                nextFocusedWindow = i
                break;
            }
            
        }
        const updatedWindows = state.windows.map((win, i) => {
            if (win.id === id) {
                return {
                    ...win,
                    isMinimized: true,
                    isFocused: false
                }
            }
            return {
                ...win,
                isFocused: i === nextFocusedWindow
            }
        })
        return { windows: updatedWindows }
    }),

<<<<<<< HEAD
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
=======
    toggleMinimize: (id) =>{
        const {restoreMinimize, minimizeWindow, windows } = get()
        const current = windows.find(win=> win.id === id)
        if (!current) return

        current.isMinimized? restoreMinimize(id) : minimizeWindow(id) 
    },

    maximizeWindow: (id) => {
        set((state) => {
            let updatedWindows = state.windows.map((win) => {
                if (win.id === id) {
                    return {
                        ...win,
                        isMaximized: !win.isMaximized,
                    }
>>>>>>> a8012dc298818ace52f68f06c8e28c3f3955af62
                }
                return win
            })
            updatedWindows = zIndexManager(updatedWindows, id)
            return { windows: updatedWindows }
        })
    },

<<<<<<< HEAD
=======
    restoreMinimize: (id) => {
        set((state) => {
            let updatedWindows = state.windows.map((win) => {
                if (win.id === id && win.isMinimized) {
                    return {
                        ...win,
                        isMinimized: false,
                    }
                }
                return win
            })
            updatedWindows = zIndexManager(updatedWindows, id)
            return { windows: updatedWindows }
        })
    },

>>>>>>> a8012dc298818ace52f68f06c8e28c3f3955af62
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

<<<<<<< HEAD
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



=======
>>>>>>> a8012dc298818ace52f68f06c8e28c3f3955af62
}

))

export default useWindowStore

