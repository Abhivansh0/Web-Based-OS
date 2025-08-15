import React, { useState } from 'react'
import AppIcon from '../appIcon/AppIcon'
import terminal from '../../assets/icons/terminal.png'
import calculator from '../../assets/icons/calculator.png'
import '../desktop/desktop.css'
import Spline from '@splinetool/react-spline';

import Taskbar from '../taskbar/Taskbar'
import StartMenu from '../startMenu/StartMenu'

const Desktop = () => {
  return (
    <>
      <div className="main_desktop">
        {/* <Spline className='object'
        scene="https://prod.spline.design/CeBHiEKvJhkWkTu5/scene.splinecode" 
      /> */}
        
        <div className="icon_grid">
          <AppIcon iconName={"Terminal"} iconImage={terminal} size={400} />
          <AppIcon iconName={"Calculator"} iconImage={calculator} size={400} />
        </div>
      </div>
    </>
  )
}

export default Desktop
