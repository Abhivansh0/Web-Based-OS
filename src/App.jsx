import React, { useState } from 'react'
import '../src/App.css'
import Desktop from './components/desktop/Desktop'
import Taskbar from './components/taskbar/Taskbar'
import StartMenu from './components/startMenu/StartMenu'
import AppWindow from './windowingSystem/AppWindow'

const App = () => {
  const [IsStart, setIsStart] = useState(false)
  const handleStartView = () => {
    setIsStart(!IsStart)
  }
  return (
    <>
      <div className="app_container">

        <main className='main_content'>
          <Desktop />
          <AppWindow />
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
