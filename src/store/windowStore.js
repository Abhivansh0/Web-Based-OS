import {create} from 'zustand'

let globalZIndex = 1
let globalZIndexArray = []

export const useWindowStore = create((set, get)=>({
    windows: [],

    addWindow: (windowsData) => set((state)=> {
        const newWindow = {
            id: windowsData.pid,
            name: windowsData.ProcessName,
            cpuUsage: windowsData.cpuUsage,
            memoryUsage: windowsData.memoryUsage,
            size: {width:1920, height:1080},
            position: {x: 100, y: 100},
            zIndex: globalZIndex++,
        }
        const updatedWindows = [...state.windows];
        updatedWindows.push(newWindow)

        return {
            windows: updatedWindows
        }
    }),

    closeWindow: (pid)=>{
        set((state)=>({
            windows: state.windows.filter((win)=> win.pid !== pid)
        }))
    }

}))