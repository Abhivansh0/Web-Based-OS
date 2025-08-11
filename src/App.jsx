import React, { useState } from 'react'
import '../src/App.css'
import Desktop from './components/desktop/Desktop'
import Taskbar from './components/taskbar/Taskbar'
import StartMenu from './components/startMenu/StartMenu'
import AppWindow from './windowingSystem/AppWindow'
import useWindowStore from './store/windowStore'
import appRegistry from './store/appRegistry'
import BootScreen from './components/bootScreen/BootScreen'
import TargetCursor from './components/cursor/TargetCursor'
import iconRegistry from './store/iconRegistry'

const App = () => {

  const [isBooting, setIsBooting] = useState(true)
  const [IsStart, setIsStart] = useState(false)
  const handleStartView = () => {
    setIsStart(!IsStart)
  }
  const windows = useWindowStore((state) => state.windows)

  return (
    <>
      <div className="app_container">

        <main className='main_content'>
          <Desktop />
          <TargetCursor spinDuration={2} hideDefaultCursor={true} />
          {isBooting && <BootScreen setBootScreen={setIsBooting} />}
          {windows.map((win) => {
            const Component = appRegistry[win.name]
            const image = iconRegistry[win.name]

            if (!Component) return null
            return (
              <AppWindow key={win.id} appImg={image} windowData={win} >
                <Component />
                
              </AppWindow>
            )
          })}

          {IsStart && <StartMenu />}
        </main>

        <footer className='taskbar' >
          <Taskbar isStart={handleStartView} />
        </footer>

      </div>
    </>
  )
}

export default App
