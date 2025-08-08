import React from 'react'
import "../taskbar/taskbar.css"
import useWindowStore from '../../store/windowStore'
import terminal from '../../assets/icons/terminal.png'
import TaskbarIcon from '../taskbarIcon/TaskbarIcon'
import iconRegistry from '../../store/iconRegistry'

const Taskbar = (props) => {

    const openedApps = useWindowStore((state)=> state.openedApps)
    const windows = useWindowStore((state)=> state.windows)
    const addWindow = useWindowStore((state) => state.addWindow);
    const bringTofront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
    const moveWindow = useWindowStore((state) => state.moveWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);
    
    return (
        <>
            <div className="taskbar">
                <div className=" taskbar_component taskbar_centre">
                    <div className="start_btn" onClick={props.isStart} ></div>
                    <div className="icons_dock">
                        {openedApps.map(win => {
                            const icon = iconRegistry[win.name]
                            const winState = windows.find(w=> w.id === win.id)
                            const isFocused = winState?.isFocused
                            return (
                                <TaskbarIcon
                                key={win.id}
                                iconImage={icon}
                                isFocused={isFocused}
                                isMinimized={winState?.isMinimized}
                                onClick = {()=>{
                                    if (winState?.isMinimized) {
                                        toggleMinimize(win.id)
                                        console.log(winState?.isMinimized)
                                    }
                                    else if(!winState?.isMinimized){
                                        bringTofront(win.id)
                                    }
                                }}
                                />
                            )
                        })}
                    </div>
                </div>
                <div className=" taskbar_component taskbar_time"></div>

            </div>
        </>
    )
}

export default Taskbar
