import React, { useState } from 'react'
import '../createPopUp/popup.css'
import useComponentStore from '../../store/ComponentStore'
import useFileSystemStore from '../../store/FileSystemStore'
import { useKernel } from '../../context/kernelContext'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


const Popup = ({ type, call }) => {
    const { openComponent, closeComponent, popUp } = useComponentStore()

    const { createFile, createFolder, deleteFile, deleteFolder, writeFile, readFile, moveFile, listFiles, renameFile } = useKernel()
    const { contextMenu, openContextMenu, closeContextMenu, cwd, setCwd, goBack, select, clearSelect, selected } = useFileSystemStore()

    const [fileName, setFileName] = useState('')

    const handleOnChange = (event) => {
        setFileName(event.target.value)
    }
    const displayType = type ?? popUp?.type
    const callFunction = call ?? popUp?.call

    const handleFileCreation = () => {
        let path
        if (popUp.call === "rename") {
            let name
            if (popUp.type === "file") {
                path = cwd + `/${selected.name}`
                name = fileName ? `${fileName}.txt`:""
                const rename = renameFile(path, name)
                if (!rename.success) {
                    alert(rename.error)
                }
            }
            else if (popUp.type === "directory") {
                path = cwd + `/${selected.name}`
                const rename = renameFile(path, fileName)
                if (!rename.success) {
                    alert(rename.error)
                }
            }
        }
        if (popUp.call === null) {
            if (popUp.type === "File") {
                path = fileName ? cwd + `/${fileName}.txt`: cwd
                const create = createFile(path)
                if (!create.success) {
                    alert(create.error)
                }
            }
            else if (popUp.type === "Folder") {
                path = cwd + `/${fileName}`
                const create = createFolder(path)
                if (!create.success) {
                    alert(create.error)
                }
            }
        }
        listFiles(cwd)
    }

    useGSAP(()=>{
        gsap.to(".popup-layer-box", {
            delay:0.2,
            stagger:0.05,
            opacity:0,
            duration:0.5,
        })
    }, [])

    const handleClose= ()=>{
        gsap.to(".popup-layer-box", {
            // delay:0.2,
            stagger:0.05,
            opacity:1,
            duration:0.5,
            onStart: ()=>{closeComponent("popUp")}
        })
    }

    return (
        <div className='popup-main' >

            <motion.div
                initial={{
                    // y: "100%",
                    opacity: 0,
                    // backdropFilter: Window.blur(5)

                }}
                animate={{
                    // y: 0,
                    opacity: 1,
                    // backdropFilter: Window.blur(0)
                }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
                exit={{
                    // y: "100%",
                    opacity: 0,
                    // backdropFilter: Window.blur(5)
                }}
                className="popup-box">

                <div className="popup-layer">
                    <div className="popup-layer-box"></div>
                    <div className="popup-layer-box"></div>
                    <div className="popup-layer-box"></div>
                    <div className="popup-layer-box"></div>
                    <div className="popup-layer-box"></div>
                    <div className="popup-layer-box"></div>
                </div>

                <div className="create-heading">
                    <h5>{callFunction === "rename" ? "Rename" : `Create ${displayType}`}</h5>
                </div>
                <div className="textArea">
                    <h5>Enter name</h5>
                    <input className='cursor-target' onChange={handleOnChange} value={fileName} placeholder='Name..' name="" id=""></input>
                </div>
                <div className="pop-btns">
                    <button className='cursor-target cancel ' onClick={() => handleClose()} >cancel</button>
                    <button className='cursor-target submit' onClick={() => { handleClose(), handleFileCreation() }} >submit</button>
                </div>
            </motion.div>
        </div>
    )
}

export default Popup
