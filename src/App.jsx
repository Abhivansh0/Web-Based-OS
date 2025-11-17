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
import { AnimatePresence } from "motion/react"
import ErrorBox from './components/errorBox/ErrorBox'

import TaskManager from './components/taskmanager/TaskManager'

const App = () => {

  const [isError, setisError] = useState(false)
  const [errorName, seterrorName] = useState('')

  const handleError = ()=>{setisError(!isError)}
  const [isBooting, setIsBooting] = useState(true)
  // const [isDesktop, setIsDesktop] = useState(false)
  const [IsStart, setIsStart] = useState(false)
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false)
  
  const handleStartView = () => {
    setIsStart(!IsStart)
  }
  
  const toggleTaskManager = () => {
  setIsTaskManagerOpen(!isTaskManagerOpen);
}

  const windows = useWindowStore((state) => state.windows)
  
  return (
    <>
      <div className="app_container">
        <main className='main_content'>
          <Desktop setErrorName={seterrorName} isError={handleError} />
          { isError && < ErrorBox errorName={errorName} isError={handleError} />}
          <TargetCursor spinDuration={2} hideDefaultCursor={true} />
          {isBooting && <BootScreen setBootScreen={setIsBooting} />}
          <AnimatePresence>
          {windows.map((win) => {
            const Component = appRegistry[win.name]
            const image = iconRegistry[win.name]

            if (!Component) return null
            return (

              <AppWindow key={win.id} appImg={image} windowData={win}>
                <Component />
              </AppWindow>
            )
          })}
          </AnimatePresence>
          <AnimatePresence>
          {IsStart && <StartMenu />}
          </AnimatePresence>
          <AnimatePresence>
         {isTaskManagerOpen && <TaskManager />}
          </AnimatePresence>
        </main>

        <footer className='taskbar-footer'>
          <Taskbar start={IsStart} taskManager={isTaskManagerOpen} isStart={handleStartView} toggleTaskManager={toggleTaskManager} />
        </footer>
      </div>
    </>
  )
}

export default App
