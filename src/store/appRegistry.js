import React from 'react'
import Terminal from '../apps/terminal/Terminal'
import Calculator from '../apps/calculator/Calculator'
import FileExplorer from '../apps/fileExplorer/FileExplorer'
import FileEditor from '../apps/fileEditor/FileEditor'

const appRegistry =  {
    "Terminal": Terminal,
    "Calculator": Calculator,
    "File Explorer": FileExplorer,
    "File Editor": FileEditor
}

export default appRegistry
