import React from 'react'
import './taskManager.css'
import DataRenderComponent from './DataRenderingComponent'
import {motion} from 'motion/react'

const TaskManager = () => {
  return (
      <motion.div
      initial={{
        opacity:0
      }}
      animate={{
        opacity:1
      }}
      exit={{
        opacity:0
      }}
      transition={{
        duration:1,
        ease:'backInOut'
      }}
      onAnimationComplete={{}}
        
       className="taskmanager-container">
        {/* <h2>Task Manager</h2> */}

        {/* Header row with column names */}
        <div className="data-row header">
          <div className="table-column">PID</div>
          <div className="table-column">App Name</div>
          <div className="table-column">Memory Usage</div>
          <div className="table-column">CPU Usage</div>
          <div className="table-column">Status</div>
        </div>
        <DataRenderComponent />
      </motion.div>
  )
}

export default TaskManager