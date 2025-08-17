import React, { useRef } from 'react'
import '../animation/LayerAnimation.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const LayerAnimation = ({numberOfBoxes, boxColor}) => {
    const layerRef = useRef()
    
    useGSAP(()=>{
        gsap.to(layerRef.current.querySelector(".layer").children, {
            stagger:0.04,
            opacity:1,
            duration:0.5,
        })
    })


  return (

    <div ref={layerRef} className='layer'>
        {Array(numberOfBoxes).fill(null).map((_, i) => (
        <div key={i} style={{backgroundColor:{boxColor}}} className="layer-box"></div>
    ))}
      
    </div>
  )
}

export default LayerAnimation
