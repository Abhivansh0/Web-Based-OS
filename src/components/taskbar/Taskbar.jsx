import React, { useEffect, useRef, useState } from 'react'
import "../taskbar/taskbar.css"
import useWindowStore from '../../store/windowStore'
import terminal from '../../assets/icons/terminal.png'
import TaskbarIcon from '../taskbarIcon/TaskbarIcon'
import iconRegistry from '../../store/iconRegistry'
import gsap from 'gsap'
import { AnimatePresence } from "motion/react"
import useComponentStore from '../../store/ComponentStore'
import { motion } from 'motion/react'
import StartMenu from '../startMenu/StartMenu'
import TaskManager from '../taskmanager/TaskManager'



const Taskbar = () => {

    const { taskBar, taskManager, startMenu, openComponent, closeComponent, toggleComponent } = useComponentStore()

    const centerRef = useRef()

    const [TaskBarBig, setTaskBarBig] = useState(false)

    const openedApps = useWindowStore((state) => state.openedApps)
    const windows = useWindowStore((state) => state.windows)
    const bringTofront = useWindowStore((state) => state.bringToFront);
    const requestAnimation = useWindowStore((state) => state.requestAnimation)

    const animation = (type) => {
        if (type === "start") {
            if (taskManager.isOpen && TaskBarBig) {
                toggleComponent("taskManager")
                toggleComponent("startMenu")
            }
            if (!startMenu.isOpen && !TaskBarBig) {
                gsap.to(centerRef.current, {
                    minWidth: "40vw",
                    height: "80vh",
                    duration: 1,
                    ease: 'circ.inOut',
                    onComplete: () => {
                        setTaskBarBig(true)
                        openComponent("startMenu");
                    }
                });
            }
            if (startMenu.isOpen && TaskBarBig) {
                closeComponent("startMenu")
                gsap.to(centerRef.current, {
                    delay: 0.5,
                    minWidth: "104.56px",
                    height: '61px',
                    duration: 1,
                    ease: "circ.inOut",
                    onComplete: () => {
                        setTaskBarBig(false)
                    },
                });
            }
        }
        else if (type === "taskManager") {
            if (startMenu.isOpen && TaskBarBig) {
                closeComponent("startMenu")
                openComponent("taskManager")
            }
            if (!taskManager.isOpen && !TaskBarBig) {
                gsap.to(centerRef.current, {
                    minWidth: "40vw",
                    height: "80vh",
                    duration: 1,
                    ease: 'circ.inOut',
                    onComplete: () => {
                        openComponent("taskManager");
                        setTaskBarBig(true)
                    }
                });
            }
            if (taskManager.isOpen && TaskBarBig) {
                closeComponent("taskManager")
                gsap.to(centerRef.current, {
                    delay: 0.5,
                    minWidth: "104.56px",
                    height: '61px',
                    duration: 1,
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
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    ref={centerRef} className=" taskbar_component taskbar_centre">


                    <AnimatePresence>
                        {startMenu.isOpen && <StartMenu key="start-menu" />}
                    </AnimatePresence>

                    <AnimatePresence>
                        {taskManager.isOpen && <TaskManager key="task-manager" />}
                    </AnimatePresence>

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
                </motion.div>
                {/* <div className=" taskbar_component taskbar_time">Hello</div> */}

            </div>
        </>
    )
}

export default Taskbar