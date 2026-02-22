import { create } from 'zustand'

const useComponentStore = create((set, get)=>({
    startMenu:{ isOpen: false },
    errorBox:{ isOpen: false },
    boot:{ isOpen: true },
    taskManager:{ isOpen: false },
    appIcon:{ isOpen: false },
    taskBar:{ isOpen: false, isBig: false },
    popUp: {isOpen: false, type: null, call: null},

    openComponent: (component, payload = null, callPayload=null)=>{set((state)=>(({
        ...state,
        [component]:{
            ...state[component],
            isOpen: true,
            type: payload ?? state[component].type,
            call: callPayload ?? state[component].call
        }
    })))},

    closeComponent: (component)=>{set((state)=>(({
        ...state,
        [component]:{
            ...state[component],
            isOpen: false,
            type: null,
            call: null
        }
    })))},

    toggleComponent: (component)=>{set((state)=>({
        ...state,
        [component]:{
            ...state[component],
            isOpen: !state[component].isOpen
        }
    }))}
    
}))

export default useComponentStore