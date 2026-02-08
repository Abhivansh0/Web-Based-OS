import { useKernel } from '../context/kernelContext';
import { create } from 'zustand'

// const { fileSystem } = useKernel()
const useFileSystemStore = create((set, get)=>({

    contextMenu:{
        isOpen:false,
        x:0,
        y:0,
        path:null

    },
    cwd: "/",
    selected: null,
    
    select: (entry)=>set({selected:entry}),

    clearSelect: ()=>set({selected: null}),

    setCwd: (fileName)=> set((state)=>({
        cwd: state.cwd === "/" ? `/${fileName}`:`${state.cwd}/${fileName}`,
        selected: null
    })),

    goBack: ()=> set((state)=>{
        if (state.cwd === "/") {
            return {cwd: "/"}
        }
        
        const pathArray = state.cwd.split("/").filter(str => str !== "")
        pathArray.pop()
        return {
            cwd: pathArray.length === 0 ?"/":`/${pathArray.join("/")}`,
            selected: null
        }
    }),


    openContextMenu: (x, y, path)=> set((state)=>({
        ...state,
        contextMenu:{
            isOpen:true,
            x,
            y,
            path
        }
    })),

    closeContextMenu: ()=> set((state)=>({
        ...state,
        contextMenu:{
            ...state.contextMenu,
            isOpen:false
        }
    })),

}))

export default useFileSystemStore;