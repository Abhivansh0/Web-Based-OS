import React from 'react'
import './taskManager.css'
import DataRenderComponent from './DataRenderingComponent'

const TaskManager = () => {
  return (
    <div className="taskmanager-overlay">
      <div className="taskmanager-container">
        <h2>Task Manager</h2>

        {/* Header row with column names */}
        <div className="data-row header">
          <div className="table-column">App Name</div>
          <div className="table-column">Memory Usage</div>
          <div className="table-column">CPU Usage</div>
          <div className="table-column">PID</div>
          <div className="table-column">Status</div>
        </div>
        <DataRenderComponent />
      </div>
    </div>
  )
}

export default TaskManager