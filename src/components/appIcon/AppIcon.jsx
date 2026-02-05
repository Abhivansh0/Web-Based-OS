import '../appIcon/appIcon.css'
import { useKernel } from '../../context/kernelContext'
import useWindowStore from '../../store/windowStore'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import useComponentStore from '../../store/ComponentStore'
import {motion} from 'motion/react'


const AppIcon = ({ iconName, iconImage, size, isError, setErrorName }) => {
  const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem, getProcessStats, getSystemStats } = useKernel()
  const addWindow = useWindowStore((state) => state.addWindow);

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
      <motion.div
      initial={{y:50, opacity:0}}
      animate={{y:0, opacity:1}}
      transition={{duration:0.5}}
      onDoubleClick={() => handleClick()} className="icon cursor-target">
        <div className="iconImage">
          <img src={iconImage} alt="" />
        </div>
        <div className="iconName"><h4>{iconName}</h4></div>

      </motion.div>

    </>
  )
}

export default AppIcon
