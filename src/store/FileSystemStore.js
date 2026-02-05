import { useKernel } from '../context/kernelContext';
import { create } from 'zustand'

// const { fileSystem } = useKernel()
const useFileSystemStore = create((set, get)=>({
    fileSystem: null,
    FileTree:[],
    files:[],
    folders:[],

    contextMenu:{
        isOpen:false,
        x:0,
        y:0,
        path:null

    },

    setFileSystem: (fs) => set((state)=>({...state, fileSystem: fs})),

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

    refreshDirectory: ()=>{
        const fs = get().fileSystem
        if (!fs) return
        const currentTree = fs.rootDirectory
        set((state)=>({...state, FileTree: {...currentTree}}))
    },

    createFile: (path, type)=>{
        const fs = get().fileSystem
        let result
        if (type === "file") {
            result=fs.createFile(path)
        }
        else if (type === "folder") {
            result = fs.createFolder(path)
        }

        if (result.success) {
            get().refreshDirectory()
            return {success:true}
        }

        return {success: false, error: result.error}
    },

    deleteFile: (path)=>{
        const fs = get().fileSystem
        let result = fs.deleteFile(path)

        if (result?.error === "FILE_DONT_EXIST") {
            result = fs.deleteFolder(path)
        }

        if (result?.success) {
            get().refreshDirectory()
            return {success:true}
        }

        return {success: false, error: result.error}
    }

}))

export default useFileSystemStore;