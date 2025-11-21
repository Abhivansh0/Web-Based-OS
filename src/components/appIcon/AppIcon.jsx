import '../appIcon/appIcon.css'
import { useKernel } from '../../context/kernelContext'
import useWindowStore from '../../store/windowStore'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'


const AppIcon = ({ iconName, iconImage, size, isError, setErrorName }) => {
  const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem, getProcessStats, getSystemStats } = useKernel()
  const addWindow = useWindowStore((state) => state.addWindow);
  const bringTofront = useWindowStore((state) => state.bringToFront);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const resizeWindow = useWindowStore((state) => state.resizeWindow);



  const iconRef = useRef()

  useGSAP(()=>{
    gsap.from(iconRef.current, {
      duration:0.5,
      y:50,
      delay:1,
      opacity:0
    })
  }, [])

  const singleClick = () => {
    gsap.to(iconRef.current, {
      backgroundColor: "#5a7676",
      duration: 0.1
    })
  }


  const handleClick = () => {
    const { success, process, error } = createApp(iconName, size)
    if (success) {
      addWindow({
        pid: process.pid,
        ProcessName: iconName,
        cpuUsage: process.cpuUsage,
        memoryUsage: process.size,
        state: process.state
      })

      console.log(getProcessStats())
      console.log(getSystemStats())
      
    }
    else {
      setErrorName(error)
      console.log(error)
      isError()
    }
  }

  return (
    <>
      <div ref={iconRef} onDoubleClick={() => handleClick()} className="icon cursor-target">
        <div className="iconImage">
          <img src={iconImage} alt="" />
        </div>
        <div className="iconName"><h4>{iconName}</h4></div>

      </div>

    </>
  )
}

export default AppIcon
