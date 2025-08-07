import React, { useState } from 'react'
import '../src/App.css'
import Desktop from './components/desktop/Desktop'
import Taskbar from './components/taskbar/Taskbar'
import StartMenu from './components/startMenu/StartMenu'
import AppWindow from './windowingSystem/AppWindow'
import useWindowStore from './store/windowStore'
import appRegistry from './store/appRegistry'

const App = () => {
  const [IsStart, setIsStart] = useState(false)
  const handleStartView = () => {
    setIsStart(!IsStart)
  }
  const windows = useWindowStore((state)=> state.windows) 

  return (
    <>
      <div className="app_container">

        <main className='main_content'>
          <Desktop />
          {windows.map((win)=>{
            const Component = appRegistry[win.name]
            // console.log('Rendering window:', win.name, 'Component:', Component)
            // console.log("full windows array", windows)

            if (!Component) return null
            return (
              <AppWindow key={win.id} windowData={win} >
                <Component/>
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
