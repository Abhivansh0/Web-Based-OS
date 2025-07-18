import '../appIcon/appIcon.css'
import { useKernel } from '../../context/kernelContext'


const AppIcon = ({iconName, iconImage, size}) => {
  const {createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem } = useKernel()

  const handleClick = ()=>{
    const process = createApp(iconName, size)

    console.log(process)

  }

  return (
    <>
    <div onDoubleClick={()=>handleClick()}  className="icon">
      <div className="iconImage">
        <img src={iconImage} alt="" />
      </div>
      <div className="iconName">{iconName}</div>

    </div>
    
    </>
  )
}

export default AppIcon
