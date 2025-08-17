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
import {motion} from 'motion/react'

const Desktop = ({isError, setErrorName}) => {

  const tagRef = useRef()

  useGSAP(()=>{
    gsap.from(tagRef.current, {
      delay:13,
      scale:5,
      duration:2,
      ease:'expo.inOut'
    })


  })

  return (
    <>
      <div className="main_desktop">

      <div className="object">
        <div ref={tagRef} className="tagline">
          <h1>YOUR</h1>
          <h1>OS IN</h1>
          <h1>WEB3</h1>
        </div>

        <video src={backVideo} autoPlay loop muted ></video>
      </div>
        
        <div className="icon_grid">
          <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Terminal"} iconImage={terminal} size={400} />
          <AppIcon setErrorName={setErrorName} isError={isError} iconName={"Calculator"} iconImage={calculator} size={400} />
        </div>
      </div>
    </>
  )
}

export default Desktop
