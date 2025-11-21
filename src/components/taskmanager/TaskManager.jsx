import React from 'react'
import './taskManager.css'
import DataRenderComponent from './DataRenderingComponent'
import {motion, transform} from 'motion/react'

const TaskManager = () => {
  return (
      <motion.div
      transformTemplate={(transform, generated)=>
        `translateX(-50%) ${generated}`
      }
      initial={{
        opacity:0,
        y:30
      }}
      animate={{
        opacity:1,
        y:0
      }}
      exit={{
        opacity:0,
        y:30
      }}
      transition={{
        duration:0.5,
        ease:'easeInOut'
      }}
       className="taskmanager-container">
        {/* <h2>Task Manager</h2> */}

        {/* Header row with column names */}
        <div className="data-row header">
          <div className="table-column table-header">PID</div>
          <div className="table-column table-header">App Name</div>
          <div className="table-column table-header">Memory Usage</div>
          <div className="table-column table-header">CPU Usage</div>
          <div className="table-column table-header">Status</div>
        </div>
        <DataRenderComponent />
      </motion.div>
  )
}

export default TaskManager