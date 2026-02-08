import React, { useEffect, useState } from 'react'
import '../SubMenu/subMenu.css'
import { Rnd } from 'react-rnd'
import { stop } from 'motion/react-client'
import { motion } from 'motion/react'
import useComponentStore from '../../store/ComponentStore'
import useFileSystemStore from '../../store/FileSystemStore'



const SubMenu = ({ contextPosition }) => {

    const [contextMenuPosition, SetcontextMenuPosition] = useState({ x: 0, y: 0 })
    useEffect(() => {
        SetcontextMenuPosition(contextPosition)

    })

    const {openComponent, closeComponent, toggleComponent, popUp} = useComponentStore()
    const {openContextMenu, closeContextMenu} = useFileSystemStore()


    return (
        <>
            <Rnd
                position={contextMenuPosition}
                disableDragging={true}
            >
                <div className="sub-menu-wrap">

                    <motion.div
                        initial={{ y:"-50%" }}
                        animate={{ y:0 }}
                        transition={{ duration: 0.2 }}
                        exit={{ y:"50%", opacity:0 }}
                        className="sub-menu-container">
                        <ul>
                            <li className='cursor-target' > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12C4 16.4183 7.58172 20 12 20C14.7485 20 17.1746 18.6137 18.6152 16.5H16V14.5H22V20.5H20V18.001C18.1762 20.4286 15.2723 22 12 22C6.47715 22 2 17.5228 2 12H4ZM11.5293 8.31934C11.7059 7.8935 12.2943 7.89349 12.4707 8.31934L12.7236 8.93066C13.1556 9.97346 13.9615 10.8062 14.9746 11.2568L15.6924 11.5762C16.1026 11.759 16.1026 12.3562 15.6924 12.5391L14.9326 12.877C13.9449 13.3162 13.1534 14.1194 12.7139 15.1279L12.4668 15.6934C12.2864 16.1075 11.7137 16.1075 11.5332 15.6934L11.2871 15.1279C10.8476 14.1193 10.0552 13.3163 9.06738 12.877L8.30762 12.5391C7.89744 12.3562 7.89741 11.759 8.30762 11.5762L9.02539 11.2568C10.0385 10.8062 10.8445 9.97348 11.2764 8.93066L11.5293 8.31934ZM12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4C9.25151 4 6.82543 5.38634 5.38477 7.5H8V9.5H2V3.5H4V5.99902C5.82382 3.57144 8.72774 2 12 2Z"></path></svg>Refresh</li>
                            <li className='cursor-target' onClick={()=>{openComponent("popUp", "File"), closeContextMenu()}} > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z"></path></svg> New File </li>
                            <li className='cursor-target' onClick={()=>{openComponent("popUp", "Folder"), closeContextMenu()}} > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5H20C20.5523 5 21 5.44772 21 6V9H19V7H11.5858L9.58579 5H4V16.998L5.5 11H22.5L20.1894 20.2425C20.0781 20.6877 19.6781 21 19.2192 21H3ZM19.9384 13H7.06155L5.56155 19H18.4384L19.9384 13Z"></path></svg> New Folder </li>
                        </ul>
                    </motion.div>
                </div>
            </Rnd>
        </>
    )
}

export default SubMenu
