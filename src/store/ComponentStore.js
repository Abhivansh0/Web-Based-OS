import { create } from 'zustand'

const useComponentStore = create((set, get)=>({
    startMenu:{ isOpen: false },
    errorBox:{ isOpen: false },
    boot:{ isOpen: true },
    taskManager:{ isOpen: false },
    appIcon:{ isOpen: false },
    taskBar:{ isOpen: false, isBig: false },

    openComponent: (component)=>{set((state)=>({
        ...state,
        [component]:{
            ...state[component],
            isOpen: true
        }
    }))},

    closeComponent: (component)=>{set((state)=>({
        ...state,
        [component]:{
            ...state[component],
            isOpen: false
        }
    }))},

    toggleComponent: (component)=>{set((state)=>({
        ...state,
        [component]:{
            ...state[component],
            isOpen: !state[component].isOpen
        }
    }))}
    
}))

export default useComponentStore