import React, { useState } from 'react'
import AppIcon from '../appIcon/AppIcon'
import terminal from '../../assets/icons/terminal.png'
import '../desktop/desktop.css'
import Taskbar from '../taskbar/Taskbar'
import StartMenu from '../startMenu/StartMenu'

const Desktop = () => {
  return (
    <>
      <div className="main_desktop">
        
        <div className="icon_grid">
          <AppIcon iconName={"Terminal"} iconImage={terminal} size={400} />
        </div>
      </div>
    </>
  )
}

export default Desktop
