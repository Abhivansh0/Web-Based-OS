import '../startMenu/startMenu.css'
import {motion} from 'motion/react'

const StartMenu = () => {
  return (
    <>
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.5, ease:'anticipate'}}
    exit={{opacity:0}}
    className="container"></motion.div>
    </>
  )
}

export default StartMenu
