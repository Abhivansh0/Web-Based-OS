import React, { useRef } from 'react'
import '../taskbarIcon/taskbarIcon.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const TaskbarIcon = ({iconImage, isFocused, onClick, isMinimized}) => {
    const imgRef = useRef()
    useGSAP(()=>{
            if (isMinimized) {
        var tl = gsap.timeline()
        tl.to(imgRef.current, {
            y:-8,
            duration: 0.5,
            ease: "expo.out"
        })
        tl.to(imgRef.current, {
            y:0,
            duration:0.5,
            ease: "bounce.out"
        })
    }
    }, [isMinimized])

  return (
    <>
    <div  onClick={onClick} className="taskBarIcon">
        <img ref={imgRef} src={iconImage} alt="" />
        <div style={{width: isFocused?"35%":"10%"}} className="iconlineIsFocused"></div>
    </div>
    </>
  )
}

export default TaskbarIcon
