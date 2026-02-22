class iNodeFileSystem {

    /**
     * @param {import('./StorageSystem.js').default} storageSystem 
     */

    constructor(storageSystem) {
        this.ss = storageSystem,
            this.BLOCK_SIZE = this.ss.blockSizeKB * 1024
        this.iNodeTable = {}                           // inode metaData is stored here ( 7={id: 7, type:file, blocks: [2, 3, 4], size: 48}  )
        this.iNodeID = 0                                // The payload of each block index is stored in disk[block_index].payload
        this.rootInode = this.iNodeID++
        this.iNodeTable[this.rootInode] = {
            id: this.rootInode,
            type: "directory",
            blocks: [],
            size: 0
        }
        // ROOT INODE STORAGE ALLOCATION
        const rootAllocation = this.ss.allocateStorage(1)

        // ATTACHING ALLOCATED BLOCKS OF ROOT INODE 
        const rootBlocks = rootAllocation.blocks
        for (const rootBlock of rootBlocks) {
            this.iNodeTable[this.rootInode].blocks.push(rootBlock)
        }

        // ROOT INODE PAYLOAD INITIALIZATION
        const rootInodeIndex = this.iNodeTable[this.rootInode].blocks[0]
        this.ss.disk[rootInodeIndex].payload = []
    }

    pushBlocks(inodeID, blocks) {
        const inode = this.iNodeTable[inodeID]
        if (!inode) {
            return { success: false, error: "INODE_NOT_FOUND" }
        }
        for (const block of blocks) {
            if (inode.blocks.includes(block)) {
                return { success: false, error: "DUPLICATE_BLOCKS" }
            }
            inode.blocks.push(block)
        }
        return { success: true }
    }

    createInode(filePath, type) {
        //RESOLVE PATH
        const parent = this.getParentNode(filePath)
        if (!parent.success) {
            return { success: false, error: parent.error }
        }

        // CREATE INODE
        const iNodeID = this.iNodeID++
        const iNode = {
            id: iNodeID,
            type: type,
            blocks: [],
            size: 0
        }
        this.iNodeTable[iNodeID] = iNode

        // ALLOCATE STORAGE
        const result = this.ss.allocateStorage(1)
        if (!result.success) {
            delete this.iNodeTable[iNodeID]
            return { success: false, error: result.error }
        }

        // ATTACH ALLOCATED BLOCKS TO THE INODE
        let attachBlock = this.pushBlocks(iNodeID, result.blocks)
        if (!attachBlock.success) {
            this.ss.deAllocateStorage(result.blocks)
            delete this.iNodeTable[iNodeID]
            return { success: false, error: attachBlock.error }
        }

        // PAYLOAD INITIALIZATION
        for (const block of this.iNodeTable[iNodeID].blocks) {
            if (type === "directory") {
                this.ss.disk[block].payload = []
            }
            else if (type === "file") {
                this.ss.disk[block].payload = ""
            }
        }

        // ADD IT TO THE DIRECTORY
        const dirResult = this.addDirectoryEntry(parent.parentInode.id, parent.childName, iNodeID)
        if (!dirResult.success) {
            this.ss.deAllocateStorage(this.iNodeTable[iNodeID].blocks)
            delete this.iNodeTable[iNodeID]
            return { success: false, error: dirResult.error }
        }
        return { success: true, inodeId: iNodeID }
    }

    estimateDirectoryEntrySize(entry) {
        return entry.name.length + 8
    }

    getDirectoryUsedBlocks(block) {
        let used = 0
        for (const entry of block.payload) {
            used += this.estimateDirectoryEntrySize(entry)
        }
        return used
    }

    addDirectoryEntry(parentInodeID, fileName, childInodeID) {
        const dirInode = this.iNodeTable[parentInodeID]

        // CHECK IF ITS A DIRECTORY 
        if (!dirInode || dirInode.type !== "directory") {
            return { success: false, error: "NOT_A_DIRECTORY" }
        }

        // CHECK FOR FILE IF ALREADY EXISTS
        for (const blockIndex of dirInode.blocks) {
            const block = this.ss.disk[blockIndex]
            for (const entry of block.payload) {
                if (entry.name === fileName) {
                    return { success: false, error: "FILE_ALREADY_EXISTS" }
                }
            }
        }

        const newEntry = { name: fileName, inodeId: childInodeID }

        // CHECK FOR SPACE
        const lastBlockIndex = dirInode.blocks[dirInode.blocks.length - 1]
        const lastBlock = this.ss.disk[lastBlockIndex]

        const usedBytes = this.getDirectoryUsedBlocks(lastBlock)
        const entrySize = this.estimateDirectoryEntrySize(newEntry)

        if (usedBytes + entrySize <= this.BLOCK_SIZE) {
            lastBlock.payload.push(newEntry);
            dirInode.size += entrySize
            return { success: true }
        }

        // ALLOCATE NEW BLOCKS IF NO SPACE
        const allocResult = this.ss.allocateStorage(1)
        if (!allocResult.success) {
            return { success: false, error: allocResult.error }
        }

        let attachBlock = this.pushBlocks(parentInodeID, allocResult.blocks)
        if (!attachBlock.success) {
            return { success: false, error: attachBlock.error }
        }

        const newBlockIndex = allocResult.blocks[0]

        // INITIALIZING PAYLOAD AND ADDING THE NEWENTRY
        try {
            this.ss.disk[newBlockIndex].payload = []
            this.ss.disk[newBlockIndex].payload.push(newEntry)
            dirInode.size += entrySize
            return { success: true }
        } catch {
            dirInode.blocks.pop()
            this.ss.deAllocateStorage([newBlockIndex])
            return { success: false, error: "DIR_EXPANSION_FAILED" }
        }
    }

    getParentNode(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "") // CREATING AN ARRAY OF THE FILEPATH

        // CHECKING IF THE ARRAY IS EMPTY
        if (pathArray.length === 0) {
            return { success: false, error: "INVALID_PATH" }
        }

        const fileName = pathArray.pop()  // OBTAINING THE NAME OF THE FILE

        // TRAVERSING [ INODE_BLOCKS -> GET_THE_INDEX -> DISK[BLOCK_INDEX] -> DISK[BLOCK_INDEX].PAYLOAD -> PAYLOAD_NAME = PATHARRAY[i]  ]
        let currentInode = this.iNodeTable[this.rootInode]

        // LOOP FOR PATHARRAY ITEMS
        for (let i = 0; i < pathArray.length; i++) {

            if (currentInode.type !== "directory") {
                return { success: false, error: "NOT_A_DIRECTORY" }
            }

            let found = false

            // LOOP FOR CURRENT_NODE BLOCKS
            for (const blockIndex of currentInode.blocks) {
                const entries = this.ss.disk[blockIndex] // TOOK THE BLOCK_INDEXES TO THE DISK

                // LOOP FOR DISK[ BLOCK_INDEXES ].PAYLOAD
                for (const entry of entries.payload) {
                    if (entry.name === pathArray[i]) {
                        currentInode = this.iNodeTable[entry.inodeId]
                        found = true
                        break
                    }
                }
                if (found) { break }
            }
            if (!found) {
                return { success: false, error: "PATH_NOT_FOUND" }
            }

        }

        return { success: true, parentInode: currentInode, childName: fileName }
    }

    resolveInode(filePath) {
        const parent = this.getParentNode(filePath)
        if (!parent.success) {
            return { success: false, error: parent.error }
        }
        const parentNode = parent.parentInode
        const fileName = parent.childName

        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            for (const entry of entries) {
                if (entry.name === fileName) {
                    return { success: true, inodeId: entry.inodeId }
                }
            }
        }

        return { success: false, error: "FILE_NOT_FOUND" }
    }

    resize(iNodeID, newSize) {
        // VALIDATING SIZE 
        if (newSize < 0) {
            return { success: false, error: "INVALID_SIZE" }
        }

        // VALIDATING NODE
        const iNode = this.iNodeTable[iNodeID]
        if (!iNode || iNode.type !== "file") {
            return { success: false, error: "INVALID_FILE" }
        }

        // CALCULATING BLOCKS
        const requiredBlocks = Math.ceil(newSize / this.BLOCK_SIZE)
        const currentBlocks = iNode.blocks.length

        // EDGE CASES
        if (requiredBlocks === currentBlocks) {
            iNode.size = newSize
            return { success: true }
        }
        else if (requiredBlocks > currentBlocks) {
            const newBlocks = requiredBlocks - currentBlocks
            const allocResult = this.ss.allocateStorage(newBlocks)
            if (!allocResult.success) {
                return { success: false, error: allocResult.error }
            }
            const pushResult = this.pushBlocks(iNodeID, allocResult.blocks)
            if (!pushResult.success) {
                this.ss.deAllocateStorage(allocResult.blocks)
                return { success: false, error: pushResult.error }
            }
            iNode.size = newSize
            return { success: true }
        }
        else if (requiredBlocks < currentBlocks) {
            const blocksToFree = iNode.blocks.splice(requiredBlocks)
            this.ss.deAllocateStorage(blocksToFree)
            iNode.size = newSize
            return { success: true }
        }
        return { success: true }
    }

    resizePublic(filePath, newSize) {
        const resolve = this.resolveInode(filePath)
        if (!resolve.success) {
            return { success: false, error: resolve.error }
        }
        const inodeId = resolve.inodeId
        const resize = this.resize(inodeId, newSize)
        if (!resize.success) {
            return { success: false, error: resize.error }
        }
        return { success: true }
    }

    writeFile(filePath, offset, data) {
        if (offset < 0) {
            return { success: false, error: "INVALID_OFFSET" }
        }

        const resolve = this.resolveInode(filePath)
        if (!resolve.success) {
            return { success: false, error: resolve.error }
        }
        const iNodeID = resolve.inodeId

        const inode = this.iNodeTable[iNodeID]
        if (!inode || inode.type !== "file") {
            return { success: false, error: "INVALID_FILE" }
        }

        if (data.length === 0) {
            return { success: true }
        }

        const endOffset = offset + data.length

        if (endOffset > inode.size) {
            const resize = this.resize(inode.id, endOffset)
            if (!resize.success) {
                return { success: false, error: resize.error }
            }
        }

        const startBlock = Math.floor(offset / this.BLOCK_SIZE)
        const endBlock = Math.floor((endOffset - 1) / this.BLOCK_SIZE)
        let dataIndex = 0

        for (let i = startBlock; i <= endBlock; i++) {
            let blockOffset = 0
            let block = inode.blocks[i]
            if (i === startBlock) {
                blockOffset = offset % this.BLOCK_SIZE
            }
            const spaceInBlock = this.BLOCK_SIZE - blockOffset
            let remainingData = data.length - dataIndex
            let chunkSize = Math.min(spaceInBlock, remainingData)
            let chunk = data.slice(dataIndex, dataIndex + chunkSize)
            let oldPayload = this.ss.disk[block].payload
            if (oldPayload === null) {
                oldPayload = ""
                this.ss.disk[block].payload = oldPayload

            }
            let newPayload = oldPayload.slice(0, blockOffset) + chunk + oldPayload.slice(blockOffset + chunkSize)
            dataIndex += chunkSize

            this.ss.disk[block].payload = newPayload
        }

        return { success: true }

    }

    readFile(filePath) {
        const resolve = this.resolveInode(filePath)
        if (!resolve.success) {
            return { success: false, error: resolve.error }
        }
        const inodeID = resolve.inodeId
        let text = ""
        const inode = this.iNodeTable[inodeID]
        if (!inode || inode.type !== "file") {
            return { success: false, error: "INVALID_FILE" }
        }
        for (const block of inode.blocks) {
            const payload = this.ss.disk[block].payload ?? ""
            text = text.concat(payload)
        }

        const result = text.slice(0, inode.size)
        return { success: true, result }
    }

    deleteFile(filePath) {
        let inodeId
        let index
        let size = 0
        let found = false

        const parent = this.getParentNode(filePath)
        if (!parent.success) {
            return { success: false, error: "INVALID_FILE" }
        }

        const fileName = parent.childName
        const parentNode = parent.parentInode

        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].name === fileName) {
                    found = true
                    inodeId = entries[i].inodeId
                    index = i
                    size = this.estimateDirectoryEntrySize(entries[i])
                    break
                }
            }
            if (found) break
        }

        if (!found) {
            return { success: false, error: "FILE_NOT_FOUND" }
        }

        const inode = this.iNodeTable[inodeId]

        if (!inode) {
            return { success: false, error: "FILE_NOT_FOUND" }
        }

        if (inode.type !== "file") {
            return { success: false, error: "NOT_A_FILE" }
        }

        if (inodeId === this.rootInode) {
            return { success: false, error: "CANNOT_DELETE_ROOT" }
        }


        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            const idx = entries.findIndex(e => e.inodeId === inodeId)
            if (idx !== -1) {
                entries.splice(idx, 1)
                break
            }
        }

        parentNode.size -= size

        this.ss.deAllocateStorage(inode.blocks)
        delete this.iNodeTable[inodeId]

        return { success: true }
    }

    deleteFolder(filePath) {
        let inodeId
        let size = 0
        let found = false
        let childPath

        const parent = this.getParentNode(filePath)
        if (!parent.success) {
            return { success: false, error: "INVALID_FOLDER" }
        }

        const folderName = parent.childName
        const parentNode = parent.parentInode

        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].name === folderName) {
                    found = true
                    inodeId = entries[i].inodeId
                    size = this.estimateDirectoryEntrySize(entries[i])
                    break
                }
            }
            if (found) break
        }

        if (!found) {
            return { success: false, error: "FOLDER_NOT_FOUND" }
        }

        const inode = this.iNodeTable[inodeId]
        if (!inode) {
            return { success: false, error: "FOLDER_NOT_FOUND" }
        }

        if (inodeId === this.rootInode) {
            return { success: false, error: "CANNOT_DELETE_ROOT" }
        }

        if (inode.type !== "directory") {
            return { success: false, error: "NOT_A_FOLDER" }
        }

        const children = []
        for (const block of inode.blocks) {
            const entries = this.ss.disk[block].payload
            for (const entry of entries) {
                children.push(entry)
            }
        }

        for (const child of children) {
            childPath = filePath + "/" + child.name
            const childNode = this.iNodeTable[child.inodeId]

            if (!childNode) continue

            if (childNode.type === "file") {
                let childDelete = this.deleteFile(childPath)
                if (!childDelete.success) {
                    return { success: false, error: `Children : ${childDelete.error}` }
                }
            }
            else if (childNode.type === "directory") {
                let childDelete = this.deleteFolder(childPath)
                if (!childDelete.success) {
                    return { success: false, error: `Children : ${childDelete.error}` }
                }
            }
        }


        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            const idx = entries.findIndex(e => e.inodeId === inodeId)
            if (idx !== -1) {
                entries.splice(idx, 1)
                break
            }
        }

        parentNode.size -= size

        this.ss.deAllocateStorage(inode.blocks)
        delete this.iNodeTable[inodeId]

        return { success: true }

    }

    renameFile(filePath, newName) {
        const parent = this.getParentNode(filePath)
        if (!parent.success) {
            return { success: false, error: "INVALID_PATH" }
        }

        if (newName === "") {
            return {success:false, error:"INVALID_NAME"}
        }

        const fileName = parent.childName
        const parentNode = parent.parentInode

        let targetEntry = null

        for (const block of parentNode.blocks) {
            const entries = this.ss.disk[block].payload
            for (const entry of entries) {
                if (entry.name === newName) {
                    return { success: false, error: "NAME_ALREADY_EXISTS" }
                }
                if (entry.name === fileName) {
                    targetEntry = entry
                }
            }
        }

        if (!targetEntry) {
            return { success: false, error: "FILE_NOT_FOUND" }
        }

        targetEntry.name = newName
        return { success: true }
    }

    move(srcPath, destDirPath) {
        const srcParentRes = this.getParentNode(srcPath)
        if (!srcParentRes.success) {
            return { success: false, error: "INVALID_SOURCE_PATH" }
        }

        const srcParent = srcParentRes.parentInode
        const srcName = srcParentRes.childName

        let inodeId = null
        let entrySize = 0

        for (const block of srcParent.blocks) {
            const entries = this.ss.disk[block].payload
            for (const entry of entries) {
                if (entry.name === srcName) {
                    inodeId = entry.inodeId
                    entrySize = this.estimateDirectoryEntrySize(entry)
                    break
                }
            }
            if (inodeId !== null) break
        }

        if (inodeId === null) {
            return { success: false, error: "SOURCE_NOT_FOUND" }
        }

        const destInode = this.iNodeTable[
            destDirPath === "/" ? this.rootInode :
                this.getParentNode(destDirPath + "/x").parentInode.id
        ]

        if (!destInode || destInode.type !== "directory") {
            return { success: false, error: "DEST_NOT_A_DIRECTORY" }
        }

        for (const block of destInode.blocks) {
            const entries = this.ss.disk[block].payload
            for (const entry of entries) {
                if (entry.name === srcName) {
                    return { success: false, error: "NAME_ALREADY_EXISTS" }
                }
            }
        }

        for (const block of srcParent.blocks) {
            const entries = this.ss.disk[block].payload
            const idx = entries.findIndex(e => e.name === srcName)
            if (idx !== -1) {
                entries.splice(idx, 1)
                break
            }
        }

        srcParent.size -= entrySize

        const addRes = this.addDirectoryEntry(destInode.id, srcName, inodeId)
        if (!addRes.success) {
            return { success: false, error: addRes.error }
        }

        return { success: true }
    }

    list(filePath) {
        let dirInode
        if (filePath === "/") {
            dirInode = this.iNodeTable[this.rootInode]
        }
        else {
            const resolve = this.resolveInode(filePath)
            if (!resolve.success) {
                return { success: false, error: resolve.error }
            }
            dirInode = this.iNodeTable[resolve.inodeId]
        }

        if (!dirInode || dirInode.type !== "directory") {
            return { success: false, error: "NOT_A_DIRECTORY" }
        }
        
        const entries = []

        for(const block of dirInode.blocks){
            const payload = this.ss.disk[block].payload
            for(const entry of payload){
                const inode = this.iNodeTable[entry.inodeId]
                if (!inode) continue

                entries.push({
                    name: entry.name,
                    type: inode.type,
                    size: inode.type === "file" ? inode.size : 0

                })
            }
        }
        return {success:true, entries}

    }

}

export default iNodeFileSystem