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
    openedApps: [],
    windows: [],
    animationRequests: {},

    requestAnimation: (id, type)=> set(state =>({
        animationRequests: {...state.animationRequests, [id]: type}
    })),

    clearAnimationRequest: (id)=>set(state=> {
        const newRequest = { ...state.animationRequests}
        delete newRequest[id]
        return {animationRequests: newRequest}
    }),

    lockWindowProps: false,
    setLockWindowProps: (lock) => set({ lockWindowProps: lock }),

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

    addWindow: (windowsData) => {
        const newApp = {
            id: windowsData.pid,
            name: windowsData.ProcessName
        }
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
        const alreadyOpen = get().openedApps.find(app=> app.name === windowsData.ProcessName)
        
        set((state) => ({
            windows: [...state.windows.map(win => ({ ...win, isFocused: false })), newWindow],
            openedApps: alreadyOpen ? state.openedApps: [...state.openedApps, newApp]
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
                })),
                openedApps: state.openedApps.filter((win)=> win.id !== pid)
            }
            
        })
    },

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
        let updatedWindows = state.windows.map((win, i) => {
            if (win.id === id) {
                return {
                    ...win,
                    isMinimized: true,
                    isFocused: false
                }
            }
            return {
                ...win
            }
        })

        if (nextFocusedWindow !== -1) {
            const nextWindowId = updatedWindows[nextFocusedWindow].id;
            updatedWindows = zIndexManager(updatedWindows, nextWindowId)
        }

        return { windows: updatedWindows }
    }),

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
                }
                return win
            })
            updatedWindows = zIndexManager(updatedWindows, id)
            return { windows: updatedWindows }
        })
    },

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

}

))

export default useWindowStore

