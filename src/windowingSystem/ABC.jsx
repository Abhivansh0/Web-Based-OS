import React from 'react'
import '../windowingSystem/appWindow.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
// CHANGE: Added useState to manage the component's own state during animations.
import { useRef, useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import useWindowStore from '../store/windowStore'
import { useKernel } from '../context/kernelContext'

const AppWindow = ({ windowData, children }) => {
    const { terminateApp } = useKernel()
    const { id, name, cpuUsage, memoryUsage, size, position, zIndex, isMinimized, isMaximized } = windowData

    const bringTofront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
    const moveWindow = useWindowStore((state) => state.moveWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);

    // --- KEY CHANGE: Introduction of Local State & Animation Flag ---
    // This is the core of the fix. We create a local "source of truth" for the Rnd
    // component's position and size. This state is updated frame-by-frame during
    // animations, creating a smooth experience. The global store is only updated
    // once the animation is complete.
    const [localPosition, setLocalPosition] = useState(position)
    const [localSize, setLocalSize] = useState(size)
    
    // This flag acts as a "lock" to prevent user interactions (like dragging) or
    // conflicting state updates while an animation is in progress.
    const [isAnimating, setIsAnimating] = useState(false)

    // CHANGE: Instead of separate refs for lastPosition and lastSize, we use a single
    // ref to store the complete pre-maximized state. This is cleaner and more reliable.
    const preMaximizedState = useRef({ position: position, size: size })

    const minimizeRef = useRef()
    const maximizeRef = useRef()
    const crossRef = useRef()
    const windowRef = useRef()
    const rndRef = useRef()

    // CHANGE: This useEffect hook synchronizes the local state with the global state (props)
    // ONLY when the component is not animating. This prevents the global store from
    // overwriting our smooth animation frames.
    useEffect(() => {
        if (!isAnimating) {
            setLocalPosition(position)
            setLocalSize(size)
            // We also update our backup state if the window is not maximized.
            if (!isMaximized) {
                preMaximizedState.current = { position, size }
            }
        }
    }, [position, size, isAnimating, isMaximized])

    const close = () => {
        closeWindow(id)
        terminateApp(id)
    }

    const handleHover = (ref) => {
        if (ref === crossRef) {
            gsap.to(ref.current, {
                backgroundColor: "red",
                duration: 0.2,
                ease: "power2.out"
            })
        } else {
            gsap.to(ref.current, {
                backgroundColor: "#333",
                duration: 0.2,
                ease: "power2.out"
            })
        }
    }

    const mouseLeave = (ref) => {
        gsap.to(ref.current, {
            backgroundColor: "black",
            duration: 0.2,
            ease: "power2.out"
        })
    }

    const minimize = () => {
        // We use the isAnimating flag to prevent starting a new animation while one is running.
        if (isAnimating) return
        setIsAnimating(true)

        // CHANGE: The animation now targets the inner div (`windowRef`) and includes
        // scale and opacity for a more polished effect. The Rnd container stays put
        // while its content animates away.
        gsap.to(windowRef.current, {
            y: window.innerHeight + 100, // Animate off-screen
            scale: 0.8,
            opacity: 0.7,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                toggleMinimize(id)
                setIsAnimating(false) // Release the lock
            }
        })
    }

    const handleMaximizeToggle = () => {
        // Use the lock to prevent conflicting actions.
        if (isAnimating) return
        setIsAnimating(true)

        // --- KEY CHANGE: The "Animate State, Not The DOM" approach ---
        // Instead of directly animating the DOM element and updating state onComplete,
        // we now animate a dummy object from progress: 0 to progress: 1.
        // In the `onUpdate` callback (which fires every frame), we calculate the
        // window's position and size and update our LOCAL STATE.
        // This makes React re-render the <Rnd> component in perfect sync with the animation.

        if (!isMaximized) {
            // Store current state before maximizing.
            preMaximizedState.current = {
                position: localPosition,
                size: localSize
            }
            const targetPos = { x: 0, y: 0 }
            const targetSize = { width: window.innerWidth, height: window.innerHeight }
            const startSize = { ...localSize }
            const startPos = { ...localPosition }
            
            gsap.to({ progress: 0 }, {
                progress: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: function() {
                    const progress = this.targets()[0].progress
                    // Interpolate size and position for the current frame
                    const currentSize = {
                        width: startSize.width + (targetSize.width - startSize.width) * progress,
                        height: startSize.height + (targetSize.height - startSize.height) * progress
                    }
                    const currentPos = {
                        x: startPos.x + (targetPos.x - startPos.x) * progress,
                        y: startPos.y + (targetPos.y - startPos.y) * progress
                    }
                    // Update local state, causing a smooth re-render of Rnd
                    setLocalSize(currentSize)
                    setLocalPosition(currentPos)
                },
                onComplete: () => {
                    // AFTER the animation, update the global store and release the lock.
                    maximizeWindow(id)
                    resizeWindow(id, targetSize)
                    moveWindow(id, targetPos)
                    setIsAnimating(false)
                }
            })

            gsap.to(windowRef.current, { borderRadius: 0, duration: 0.5, ease: "power2.inOut" })

        } else {
            // Restore from fullscreen using the same "animate state" technique.
            const { position: restorePos, size: restoreSize } = preMaximizedState.current
            const startSize = { ...localSize }
            const startPos = { ...localPosition }
            
            gsap.to({ progress: 0 }, {
                progress: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: function() {
                    const progress = this.targets()[0].progress
                    const currentSize = {
                        width: startSize.width + (restoreSize.width - startSize.width) * progress,
                        height: startSize.height + (restoreSize.height - startSize.height) * progress
                    }
                    const currentPos = {
                        x: startPos.x + (restorePos.x - startPos.x) * progress,
                        y: startPos.y + (restorePos.y - startPos.y) * progress
                    }
                    setLocalSize(currentSize)
                    setLocalPosition(currentPos)
                },
                onComplete: () => {
                    maximizeWindow(id)
                    resizeWindow(id, restoreSize)
                    moveWindow(id, restorePos)
                    setIsAnimating(false)
                }
            })

            gsap.to(windowRef.current, { borderRadius: 10, duration: 0.5, ease: "power2.inOut" })
        }
    }

    // --- KEY CHANGE: Robust Restore-from-Minimize Logic ---
    // The original useGSAP hook could fire on any render. This new logic uses a ref
    // to track if the window *was* minimized. The restore animation now ONLY fires
    // on the specific transition from isMinimized: true -> false.
    const wasMinimized = useRef(false)
    
    useGSAP(() => {
        if (isMinimized) {
            wasMinimized.current = true // Set the flag when minimized.
        } else if (wasMinimized.current && windowRef.current && !isAnimating) {
            // Only animate if the flag is true (meaning we are restoring).
            gsap.fromTo(windowRef.current, 
                { y: window.innerHeight + 100, scale: 0.8, opacity: 0.7 },
                { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
            )
            wasMinimized.current = false // Reset the flag after animating.
        }
    }, [isMinimized])

    // CHANGE: Optimization. Don't render the component at all if it's minimized
    // and not in the middle of its closing animation. This is more efficient.
    if (isMinimized && !isAnimating) {
        return null
    }

    return (
        <Rnd
            ref={rndRef}
            onDragStart={() => bringTofront(id)}
            onResize={() => bringTofront(id)}
            onDragStop={(e, d) => {
                // Only update position from dragging if not maximized or animating.
                if (!isMaximized && !isAnimating) {
                    const newPos = { x: d.x, y: d.y }
                    setLocalPosition(newPos) // Update local state first
                    moveWindow(id, newPos)
                }
            }}
            onResizeStop={(e, direction, ref, delta, newPos) => {
                // Only update state from resizing if not maximized or animating.
                if (!isMaximized && !isAnimating) {
                    const newSize = {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height)
                    }
                    setLocalSize(newSize)
                    setLocalPosition(newPos)
                    resizeWindow(id, newSize)
                    moveWindow(id, newPos)
                }
            }}
            // --- KEY CHANGE: Rnd is now controlled by LOCAL state ---
            // This allows our onUpdate animation to drive the component's position
            // and size smoothly, without fighting with props from the global store.
            size={localSize}
            position={localPosition}
            minWidth={400}
            minHeight={300}
            bounds="body"
            dragHandleClassName="status_bar"
            // CHANGE: Added explicit controls to prevent user interaction during
            // animations or when the window is maximized. This improves stability.
            disableDragging={isMaximized || isAnimating}
            enableResizing={!isMaximized && !isAnimating}
        >
            <div
                style={{ zIndex: zIndex }}
                onClick={() => bringTofront(id)}
                ref={windowRef}
                className="app_window"
            >
                <div
                    onDoubleClick={handleMaximizeToggle}
                    onMouseDown={(e) => {
                        // Small UX improvement: bring to front on mouse down, not just on drag start.
                        bringTofront(id)
                    }}
                    className="status_bar"
                >
                    <div className="app_name">{name}</div>
                    <div className="window_btns">
                        <button
                            ref={minimizeRef}
                            onMouseEnter={() => handleHover(minimizeRef)}
                            onMouseLeave={() => mouseLeave(minimizeRef)}
                            onClick={minimize}
                            className='minimize'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 11V13H19V11H5Z"></path>
                            </svg>
                        </button>

                        <button
                            ref={maximizeRef}
                            onClick={handleMaximizeToggle}
                            onMouseEnter={() => handleHover(maximizeRef)}
                            onMouseLeave={() => mouseLeave(maximizeRef)}
                            className='maximize'
                        >
                            {isMaximized ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.99979 7V3C6.99979 2.44772 7.4475 2 7.99979 2H20.9998C21.5521 2 21.9998 2.44772 21.9998 3V16C21.9998 16.5523 21.5521 17 20.9998 17H17V20.9925C17 21.5489 16.551 22 15.9925 22H3.00728C2.45086 22 2 21.5511 2 20.9925L2.00276 8.00748C2.00288 7.45107 2.4518 7 3.01025 7H6.99979ZM8.99979 7H15.9927C16.549 7 17 7.44892 17 8.00748V15H19.9998V4H8.99979V7ZM4.00255 9L4.00021 20H15V9H4.00255Z"></path>
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z"></path>
                                </svg>
                            }
                        </button>

                        <button
                            ref={crossRef}
                            onClick={close}
                            onMouseEnter={() => handleHover(crossRef)}
                            onMouseLeave={() => mouseLeave(crossRef)}
                            className='cross'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="content">
                    {children}
                </div>
            </div>
        </Rnd>
    )
}

export default AppWindow