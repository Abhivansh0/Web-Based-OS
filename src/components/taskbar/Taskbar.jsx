import React from 'react'
import "../taskbar/taskbar.css"

const Taskbar = (props) => {
    return (
        <>
            <div className="taskbar">
                <div className=" taskbar_component taskbar_centre">
                    <div className="start_btn" onClick={props.isStart} ></div>
                    <div className="icons_dock"></div>
                </div>
                <div className=" taskbar_component taskbar_time"></div>

            </div>
        </>
    )
}

export default Taskbar
