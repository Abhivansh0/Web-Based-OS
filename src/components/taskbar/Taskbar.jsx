import React, { useRef } from 'react'
import "../taskbar/taskbar.css"
import useWindowStore from '../../store/windowStore'
import terminal from '../../assets/icons/terminal.png'
import TaskbarIcon from '../taskbarIcon/TaskbarIcon'
import iconRegistry from '../../store/iconRegistry'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { isTypedArray } from 'three/src/animation/AnimationUtils.js'
import { AnimatePresence } from 'motion/react'

const Taskbar = ({ isStart, start, toggleTaskManager }) => {

      useGSAP(()=>{
    gsap.from(centerRef.current, {
        duration:0.5,
      y:50,
      delay:15,
      opacity:0
    })
  }, [])

    const centerRef = useRef()

    const openedApps = useWindowStore((state) => state.openedApps)
    const windows = useWindowStore((state) => state.windows)
    const restoreMinimize = useWindowStore((state) => state.restoreMinimize)
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
    const addWindow = useWindowStore((state) => state.addWindow);
    const bringTofront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
    const moveWindow = useWindowStore((state) => state.moveWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);
    const requestAnimation = useWindowStore((state) => state.requestAnimation)

    const animation = () => {
        if (!start) {
            gsap.to(centerRef.current, {
                minWidth: "40vw",
                height: "80vh",
                duration: 1,
                ease: 'circ.inOut',
                onComplete: () => {
                        isStart(); // Now isStart will only be called after animation completes
                }
            });
        }
        if (start) {
            gsap.to(centerRef.current, {
                minWidth: "104.56px",
                height: '61px',
                duration: 1, // Added duration
                ease: "circ.inOut",
                onStart: () => {
                    isStart(); // Moved from onStart to onComplete
                },
                // onComplete: () => {
                //     gsap.delayedCall(0.01, () => {
                //         gsap.to(centerRef.current, {
                //             width: ''
                //         })
                //     })
                // }
            });
        }
    }


    return (
        <>
            <div className="taskbar">
                <div ref={centerRef} className=" taskbar_component taskbar_centre">
                    <div className="start_btn cursor-target" onClick={animation} ></div>
                    
                    <div
                      className="taskmanager_btn cursor-target"
                      onClick={toggleTaskManager}
                      title="Open Task Manager"
                    ></div>
                    
                    <div className="icons_dock">
                        <AnimatePresence mode='popLayout'>
                        {openedApps.map(win => {
                            const icon = iconRegistry[win.name]
                            const winState = windows.find(w => w.id === win.id)
                            const isFocused = winState?.isFocused
                            return (
                                <TaskbarIcon
                                key={win.id}
                                iconImage={icon}
                                isFocused={isFocused}
                                isMinimized={winState?.isMinimized}
                                onClick={() => {
                                    if (!isFocused && !winState?.isMinimized) {
                                        bringTofront(win.id)
                                    }
                                    else {
                                        const action = winState?.isMinimized ? "restore" : "minimize";
                                        requestAnimation(win.id, action)
                                    }
                                    
                                }}
                                />
                            )
                        })}
                        </AnimatePresence>
                    </div>
                </div>
                {/* <div className=" taskbar_component taskbar_time">Hello</div> */}

            </div>
        </>
    )
}

export default Taskbar