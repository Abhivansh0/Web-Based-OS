import React, { useRef, useState } from 'react'
import "../taskbar/taskbar.css"
import useWindowStore from '../../store/windowStore'
import terminal from '../../assets/icons/terminal.png'
import TaskbarIcon from '../taskbarIcon/TaskbarIcon'
import iconRegistry from '../../store/iconRegistry'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { isTypedArray } from 'three/src/animation/AnimationUtils.js'
import { AnimatePresence } from 'motion/react'

const Taskbar = ({ isStart, start, toggleTaskManager, taskManager }) => {
    useGSAP(() => {
        gsap.from(centerRef.current, {
            duration: 0.5,
            y: 50,
            delay: 1,
            opacity: 0
        })
    }, [])

    const centerRef = useRef()

    const [TaskBarBig, setTaskBarBig] = useState(false)

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

    const animation = (type) => {
        if (type === "start") {
            if (taskManager && TaskBarBig) {
                toggleTaskManager()
                isStart()
            }
            if (!start && !TaskBarBig) {
                gsap.to(centerRef.current, {
                    minWidth: "40vw",
                    height: "80vh",
                    duration: 1,
                    ease: 'circ.inOut',
                    onComplete: () => {
                        setTaskBarBig(true)
                        isStart(); // Now isStart will only be called after animation completes
                    }
                });
            }
            if (start && TaskBarBig) {
                isStart()
                // setTaskBarBig(false)
                gsap.to(centerRef.current, {
                    delay: 0.5,
                    minWidth: "104.56px",
                    height: '61px',
                    duration: 1, // Added duration
                    ease: "circ.inOut",
                    onComplete: () => {
                        setTaskBarBig(false)
                    },
                });
            }
        }
        else if (type === "taskManager") {
            if (start && TaskBarBig) {
                isStart()
                toggleTaskManager()
            }
            if (!taskManager && !TaskBarBig) {
                gsap.to(centerRef.current, {
                    minWidth: "40vw",
                    height: "80vh",
                    duration: 1,
                    ease: 'circ.inOut',
                    onComplete: () => {
                        toggleTaskManager(); // Now isStart will only be called after animation completes
                        setTaskBarBig(true)
                    }
                });
            }
            if (taskManager && TaskBarBig) {
                toggleTaskManager()
                // setTaskBarBig(false)
                gsap.to(centerRef.current, {
                    delay: 0.5,
                    minWidth: "104.56px",
                    height: '61px',
                    duration: 1, // Added duration
                    ease: "circ.inOut",
                    onComplete: () => {
                        setTaskBarBig(false)
                    },
                });
            }
        }

    }


    return (
        <>
            <div className="taskbar">
                <div ref={centerRef} className=" taskbar_component taskbar_centre">
                    <div
                        className=" task_btn start_btn cursor-target"
                        onClick={() => animation("start")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19ZM8 15H16V17H8V15Z"></path></svg>                    </div>
                    <div
                        className=" task_btn taskmanager_btn cursor-target"
                        onClick={() => animation("taskManager")}
                    //   title="Open Task Manager"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 4H21V6H11V4ZM11 8H17V10H11V8ZM11 14H21V16H11V14ZM11 18H17V20H11V18ZM3 4H9V10H3V4ZM5 6V8H7V6H5ZM3 14H9V20H3V14ZM5 16V18H7V16H5Z"></path></svg>
                    </div>


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