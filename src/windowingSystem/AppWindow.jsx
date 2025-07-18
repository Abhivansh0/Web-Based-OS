import React from 'react'
import '../windowingSystem/appWindow.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'



const AppWindow = () => {
    const [Maximize, setMaximize] = useState(false)
    const [WindowPosition, setWindowPosition] = useState({ x: 100, y: 100 })
    const [WindowSize, setWindowSize] = useState({ width: 800, height: 500 })

    let lastPosition = useRef(WindowPosition)
    let lastSize = useRef(WindowSize)

    const minimizeRef = useRef()
    const maximizeRef = useRef()
    const crossRef = useRef()
    const windowRef = useRef()

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

    const handleMaximizeToggle = () => {
        const el = windowRef.current;
        const target = el.parentElement; // the Rnd wrapper div

        if (!Maximize) {
            gsap.to(target, {
                onStart: () => {
                    setMaximize(true)
                },
                width: window.innerWidth,
                height: window.innerHeight - 46,
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "power2.inOut",
                onComplete: () => {
                    setWindowSize({ width: window.innerWidth, height: window.innerHeight - 46 });
                    setWindowPosition({ x: 0, y: 0 });

                },
            });
            gsap.to(el, {
                border: "none",
                borderRadius: 0,
            })
        } else {
            gsap.to(target, {
                onStart: () => {
                    setMaximize(false)
                },
                width: lastSize.current.width,
                height: lastSize.current.height,
                x: lastPosition.current.x,
                y: lastPosition.current.y,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setWindowSize(lastSize.current);
                    setWindowPosition(lastPosition.current);
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
                default={{
                    x: 100,
                    y: 100,
                    width: 800,
                    height: 500,
                }}
                onDragStop={(e, d) => {
                    const newPos = { x: d.x, y: d.y }
                    setWindowPosition(newPos)
                    if (!Maximize) {
                        lastPosition.current = newPos
                    }
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    const newSize = {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height)
                    }
                    setWindowSize(newSize)
                    if (!Maximize) {
                        lastSize.current = newSize

                    }
                    setWindowPosition(position)

                }}
                size={Maximize ? { width: window.innerWidth, height: window.innerHeight - 46 } : WindowSize}
                position={Maximize ? { x: 0, y: 0 } : lastPosition.current}
                minWidth={600}
                minHeight={400}
                bounds="body"
                dragHandleClassName="status_bar"
            >
                <div ref={windowRef} className="app_window">
                    <div onDoubleClick={() => handleMaximizeToggle()} className="status_bar">
                        <div className="app_name">Terminal</div>
                        <div className="window_btns">

                            <button
                                ref={minimizeRef}
                                onMouseEnter={() => handleHover(minimizeRef)}
                                onMouseLeave={() => mouseLeave(minimizeRef)}
                                className='minimize'
                            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg>
                            </button>

                            <button
                                ref={maximizeRef}
                                onClick={() => handleMaximizeToggle()}
                                onMouseEnter={() => handleHover(maximizeRef)}
                                onMouseLeave={() => mouseLeave(maximizeRef)}
                                className='maximize'
                            >{Maximize ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99979 7V3C6.99979 2.44772 7.4475 2 7.99979 2H20.9998C21.5521 2 21.9998 2.44772 21.9998 3V16C21.9998 16.5523 21.5521 17 20.9998 17H17V20.9925C17 21.5489 16.551 22 15.9925 22H3.00728C2.45086 22 2 21.5511 2 20.9925L2.00276 8.00748C2.00288 7.45107 2.4518 7 3.01025 7H6.99979ZM8.99979 7H15.9927C16.549 7 17 7.44892 17 8.00748V15H19.9998V4H8.99979V7ZM4.00255 9L4.00021 20H15V9H4.00255Z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z"></path></svg>}</button>

                            <button
                                ref={crossRef}
                                onMouseEnter={() => { handleHover(crossRef) }}
                                onMouseLeave={() => mouseLeave(crossRef)}
                                className='cross'
                            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div className="content">CONTENT</div>
                </div>
            </Rnd>
        </>
    )
}

export default AppWindow
