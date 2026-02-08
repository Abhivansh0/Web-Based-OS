import { create } from 'zustand'

const useFileEditorStore = create((set, get) => ({
  editors: {}, // keyed by windowId; only meta/UI state here (no file content)

  createEditor: (windowId, meta = {}) =>  set((state) => ({
    editors: {
      ...state.editors,
      [windowId]: {
        meta,
        dirty: false,
      }
    }
  })),

  canCreateEditor: (filePath) => {
    const state = get()
    const isDuplicate = Object.values(state.editors).some(
        editor => editor.meta?.filePath === filePath
    )
    if (isDuplicate) {
        return false
    }
    return true
  },

// createEditor: (windowId, meta = {}) => {
//   const state = get()
//   // Check if this file is already open in another window
//   const isDuplicate = Object.values(state.editors).some(
//     editor => editor.meta?.filePath === meta.filePath
//   )
  
//   if (isDuplicate) {
//     console.log('File already open in another editor')
//     return false
//   }
  
//   set((state) => ({
//     editors: {
//       ...state.editors,
//       [windowId]: {
//         meta,
//         dirty: false,
//       }
//     }
//   }))
//   return true
// },

  removeEditor: (windowId) => set((state) => {
    const next = { ...state.editors }
    delete next[windowId]
    return { editors: next }
  }),

  setMeta: (windowId, meta) => set((state) => ({
    editors: {
      ...state.editors,
      [windowId]: {
        ...state.editors[windowId],
        meta: {
          ...state.editors[windowId]?.meta,
          ...meta
        }
      }
    }
  })),

  setDirty: (windowId, dirty = true) => set((state) => ({
    editors: {
      ...state.editors,
      [windowId]: {
        ...state.editors[windowId],
        dirty
      }
    }
  })),

  setClean: (windowId, dirty = false) => set((state) => ({
    editors: {
      ...state.editors,
      [windowId]: {
        ...state.editors[windowId],
        dirty
      }
    }
  })),
  

}))

export default useFileEditorStore
