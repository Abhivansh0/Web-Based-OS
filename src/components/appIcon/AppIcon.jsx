import '../appIcon/appIcon.css'
import { useKernel } from '../../context/kernelContext'
import useWindowStore from '../../store/windowStore'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'


const AppIcon = ({ iconName, iconImage, size }) => {
  const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem } = useKernel()
  const addWindow = useWindowStore((state) => state.addWindow);
  const bringTofront = useWindowStore((state) => state.bringToFront);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const resizeWindow = useWindowStore((state) => state.resizeWindow);



  const iconRef = useRef()

  const singleClick = () => {
    gsap.to(iconRef.current, {
      backgroundColor: "#5a7676",
      duration: 0.1
    })
  }


  const handleClick = () => {
    const { success, process, error } = createApp(iconName, size)
    console.log(process)
    if (success) {
      addWindow({
        pid: process.pid,
        ProcessName: iconName,
        cpuUsage: process.cpuUsage,
        memoryUsage: process.size,
        state: process.state
      })
    }
    else {
      alert(error)
    }
  }

  return (
    <>
      <div ref={iconRef} onDoubleClick={() => handleClick()} className="icon">
        <div className="iconImage">
          <img src={iconImage} alt="" />
        </div>
        <div className="iconName">{iconName}</div>

      </div>

    </>
  )
}

export default AppIcon
