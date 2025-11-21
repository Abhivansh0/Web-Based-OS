import '../startMenu/startMenu.css'
import {motion} from 'motion/react'

const StartMenu = () => {
  return (
    <>
    <div className="start_wrap">
    <motion.div 
    initial={{opacity:0, y:30}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.5, ease:'easeInOut'}}
    exit={{opacity:0, y:30}}
    className="container"></motion.div>
    </div>
    </>
  )
}

export default StartMenu
