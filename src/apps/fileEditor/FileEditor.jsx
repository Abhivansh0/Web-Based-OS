import React, { useEffect, useRef, useState } from 'react'
import '../fileEditor/fileEditor.css'
import { useKernel } from '../../context/kernelContext'
import useFileEditorStore from '../../store/fileEditorStore'
import useFileSystemStore from '../../store/FileSystemStore'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


const FileEditor = ({windowId}) => {
    const {writeFile, readFile} = useKernel()
    const editor = useFileEditorStore((state)=>state.editors[windowId])
    const setDirty = useFileEditorStore(state => state.setDirty)
    const setClean = useFileEditorStore(state => state.setClean)
    const [content, setcontent] = useState('')

    useEffect(()=>{
        // if (!editor.content) return
        if (!editor?.meta?.filePath) return

        const read = readFile(editor.meta.filePath)
        if (!read.success) {
            alert(result.error)
            return
        }
        const content = read.result
        setcontent(content)

    }, [editor?.meta?.filePath])

    const handleOnchange= (event)=>{
        setcontent(event.target.value)
        setDirty(windowId)
    }
    const handleSave = ()=>{
        if (!editor.dirty) return
        const write = writeFile(editor.meta.filePath, 0, content)
        if (!write.success) {
            alert(write.error)
        }
        else if(write.success){
            setClean(windowId)
        }
    }

 


  return (
    <div className='editor-main' >
        <div style={{backgroundColor: editor?.dirty? "#7f7979": "#2e2e2e"}} className="editor-status-bar">
            <div onClick={()=>handleSave()} className="save cursor-target ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19V13H17V19H19V7.82843L16.1716 5H5V19H7ZM4 3H17L21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM9 15V19H15V15H9Z"></path></svg>
                <h5>Save File</h5>
            </div>
        </div>
        {/* <button onClick={()=>console.log(`${editor.meta.filePath} -> ${content}`)} >click</button> */}
        <textarea onChange={handleOnchange} value={content} ></textarea>
    </div>
  )
}

export default FileEditor
