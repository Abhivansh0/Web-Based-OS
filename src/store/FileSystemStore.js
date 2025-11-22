import { fieldset } from 'motion/react-client';
import { create } from 'zustand'

const useFileSystemStore = create((set, get)=>({
    FileTree:[],
    files:[],
    folders:[],

    contextMenu:{
        isOpen:false,
        x:0,
        y:0,
        path:null

    },

    openContextMenu: (x, y, path)=> set((state)=>({
        contextMenu:{
            isOpen:true,
            x,
            y,
            path
        }
    })),

    closeContextMenu: ()=> set((state)=>({
        contextMenu:{
            ...state.contextMenu,
            isOpen:false
        }
    })),

    addFile: (fileData)=>{
        const newFile = {
            path: fileData.path,
            content: fileData.content,
            type: fileData.type
        }

        if (fileData.type === "file") {
            set((state)=>({
                files: [...(state.files || []), newFile]
            }))
        }
        else if (fileData.type === "folder") {
            set((state)=>({
                folders: [...(state.folders || []), newFile]
            }))
        }
        
    }
}))

export default useFileSystemStore;