import React from 'react'
import '../windowingSystem/appWindow.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import appRegistry from '../store/appRegistry'
import useWindowStore from '../store/windowStore'
import { useKernel } from '../context/kernelContext'




const AppWindow = ({ windowData, children }) => {
    const { createApp, terminateApp, memoryManager, processManager, scheduler, storageSystem, fileSystem } = useKernel()

    const { id, name, cpuUsage, memoryUsage, state, size, position, zIndex, isMinimized, isMaximized, isFocused } = windowData

    const windows = useWindowStore((state) => state.windows)
    const addWindow = useWindowStore((state) => state.addWindow);
    const bringTofront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
    const moveWindow = useWindowStore((state) => state.moveWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);

    let lastPosition = useRef(position)
    let lastSize = useRef(size)

    const minimizeRef = useRef()
    const maximizeRef = useRef()
    const crossRef = useRef()
    const windowRef = useRef()

    const close = () => {
        closeWindow(id)
        terminateApp(id)
    }

    const handleHover = (ref) => {
        if (ref === crossRef) {
            gsap.to(ref.current, {
                backgroundColor: "red",
                duration: 0.1
            })
        }
        else {
            gsap.to(ref.current, {
                backgroundColor: "#333",
                duration: 0.1
            })

        }
    }
    const mouseLeave = (ref) => {
        gsap.to(ref.current, {
            backgroundColor: "black",
            duration: 0.1
        })
    }

    useGSAP(() => {
        const el = windowRef.current
        const target = el.parentElement
        lastPosition.current = position
        lastSize.current = size
        if (!isMinimized) {
            gsap.to(target, {
                y: lastPosition.current.y,
                duration: 0.5,
                ease: "power1.inOut"
            },
            )
        }
    }, [isMinimized])

    const minimize = () => {
        const el = windowRef.current
        const target = el.parentElement
        lastPosition.current = position
        lastSize.current = size

        gsap.to(target, {
            y: "100vh",
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: () => {
                toggleMinimize(id)
            }
        })

    }

    const handleMaximizeToggle = () => {

        const el = windowRef.current;
        const target = el.parentElement;
        if (!isMaximized) {

            lastPosition.current = position
            lastSize.current = size

            gsap.to(target, {
                width: window.innerWidth,
                height: window.innerHeight - 46,
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "power2.inOut",
                onComplete: () => {
                    maximizeWindow(id)
                    resizeWindow(id, { width: window.innerWidth, height: window.innerHeight - 46 });
                    moveWindow(id, { x: 0, y: 0 })
                    // console.log(useWindowStore.getState().windows.find(w => w.id === id))
                    console.log(windows)
                },
            });
            gsap.to(el, {
                border: "none",
                borderRadius: 0,
            })
        } else {
            gsap.to(target, {
                width: lastSize.current.width,
                height: lastSize.current.height,
                x: lastPosition.current.x,
                y: lastPosition.current.y,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    maximizeWindow(id)
                    resizeWindow(id, lastSize.current);
                    moveWindow(id, lastPosition.current)
                    // console.log(useWindowStore.getState().windows.find(w => w.id === id))
                    console.log(windows)

                },
            });
            gsap.to(el, {
                border: "1px solid grey",
                borderRadius: 10
            })
        }
    }

    return (
        <>
            <Rnd
                onDragStart={
                    (ref) => { bringTofront(id) }

                }
                onResize={() => bringTofront(id)}
                onDragStop={(e, d) => {
                    const newPos = { x: d.x, y: d.y }
                    if (!isMaximized) {
                        lastPosition.current = newPos
                        moveWindow(id, newPos)
                        console.log(useWindowStore.getState().windows.find(w => w.id === id))
                    }
                }}
                onResizeStop={(e, direction, ref, delta, newPos) => {
                    const newSize = {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height)
                    }
                    if (!isMaximized) {
                        lastSize.current = newSize
                        lastPosition.current = newPos
                        resizeWindow(id, newSize)
                        moveWindow(id, newPos)
                        console.log(useWindowStore.getState().windows.find(w => w.id === id))

                    }

                }}
                size={isMaximized ? { width: window.innerWidth, height: window.innerHeight - 46 } : size}
                position={isMaximized ? { x: 0, y: 0 } : position}
                minWidth={600}
                minHeight={400}
                bounds="body"
                dragHandleClassName="status_bar"
            >
                <div style={{ zIndex: zIndex }} onClick={() => bringTofront(id)} ref={windowRef} className="app_window">
                    <div onDoubleClick={() => handleMaximizeToggle()} className="status_bar">
                        <div className="app_name">{name}</div>
                        <div className="window_btns">

                            <button
                                ref={minimizeRef}
                                onMouseEnter={() => handleHover(minimizeRef)}
                                onMouseLeave={() => mouseLeave(minimizeRef)}
                                onClick={() => minimize()}
                                className='minimize'
                            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg>
                            </button>

                            <button
                                ref={maximizeRef}
                                onClick={() => handleMaximizeToggle()}
                                onMouseEnter={() => handleHover(maximizeRef)}
                                onMouseLeave={() => mouseLeave(maximizeRef)}
                                className='maximize'
                            >{isMaximized ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99979 7V3C6.99979 2.44772 7.4475 2 7.99979 2H20.9998C21.5521 2 21.9998 2.44772 21.9998 3V16C21.9998 16.5523 21.5521 17 20.9998 17H17V20.9925C17 21.5489 16.551 22 15.9925 22H3.00728C2.45086 22 2 21.5511 2 20.9925L2.00276 8.00748C2.00288 7.45107 2.4518 7 3.01025 7H6.99979ZM8.99979 7H15.9927C16.549 7 17 7.44892 17 8.00748V15H19.9998V4H8.99979V7ZM4.00255 9L4.00021 20H15V9H4.00255Z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z"></path></svg>}</button>

                            <button
                                ref={crossRef}
                                onClick={() => close()}
                                onMouseEnter={() => { handleHover(crossRef) }}
                                onMouseLeave={() => mouseLeave(crossRef)}
                                className='cross'
                            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div className="content">
                        {children}
                    </div>
                </div>
            </Rnd>
        </>
    )
}

export default AppWindow
