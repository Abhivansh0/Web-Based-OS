import React, { useRef, useState } from 'react'
import AppIcon from '../appIcon/AppIcon'
import terminal from '../../assets/icons/terminal.png'
import calculator from '../../assets/icons/calculator.png'
import '../desktop/desktop.css'
import Spline from '@splinetool/react-spline';
import Taskbar from '../taskbar/Taskbar'
import StartMenu from '../startMenu/StartMenu'
import backImg from '../../assets/images/image.png'
import GlassSurface from '../bootScreen/GlassSurface'
import LiquidChrome from './LiquidChrome'
import backVideo from '../../assets/images/background.mp4'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useFileSystemStore from '../../store/FileSystemStore'

const Desktop = ({isError, setErrorName}) => {

   const { contextMenu, openContextMenu, closeContextMenu } = useFileSystemStore();

    const handleRightClick = (e)=>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // console.log(`Mouse Position: X=${mouseX}, Y=${mouseY}`);
    // console.log(contextMenu)

    const newPos = {
      x: mouseX,
      y: mouseY
    }
    openContextMenu(mouseX, mouseY, "/")

  }

  const tagRef = useRef()

  return (
    <>
      <div onContextMenu={(e)=>handleRightClick(e)} onClick={()=>closeContextMenu()} className="main_desktop">

      <div className="object">

        <video src={backVideo} autoPlay loop muted ></video>
      </div>
        
        <div className="icon_grid">
          <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Terminal"} iconImage={terminal} size={4096} />
          <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Calculator"} iconImage={calculator} size={4096} />
        </div>
      </div>
    </>
  )
}

export default Desktop
