class StorageSystem {
    constructor(totalStorageKB, blockSizeKB) {
        this.totalKB = totalStorageKB
        this.blockSizeKB = blockSizeKB
        this.totalBlocks = Math.floor(this.totalKB / this.blockSizeKB)
        this.disk = new Array(this.totalBlocks).fill(null)
        this.fileTable = {}
    }

    allocateStorage(path, sizeKB) {
        if (this.fileTable[path]) {
            return {success: false, error: "ALREADY_EXIST"}
        }

        const blocksNeeded = Math.ceil(sizeKB / this.blockSizeKB)
        const freeBlocks = this.getFreeBlocksIndex()

        if (freeBlocks.length < blocksNeeded) {
            return {success: false, error: "OUT_OF_STORAGE"}
        }
        
        const allocatedBlocks = freeBlocks.slice(0, blocksNeeded)
        allocatedBlocks.forEach(index => this.disk[index] = path)

        this.fileTable[path] = {
            size: sizeKB,
            blocks: allocatedBlocks,
        }
        return {success: true}
    }

    deAllocateStorage(path) {
        if (!this.fileTable[path]) {
            return {success: false, error: "FILE_NOT_FOUND"}
        }

        const deAllocatingBlocks = this.fileTable[path].blocks
        deAllocatingBlocks.forEach(index => this.disk[index] = null)
        delete this.fileTable[path]

        return {success: true}
    }

    getFreeBlocksIndex() {
        return this.disk.map((b, i) => b === null ? i : null).filter(i => i !== null)
    }


    getUsedStorage() {
        return this.disk.filter(block => block !== null).length * this.blockSizeKB
    }

    getAvailableStorage() {
        return this.totalKB - this.getUsedStorage()
    }


    listStorage() {
        return Object.entries(this.fileTable).map(([path, meta]) => ({
            path,
            sizeKB: meta.size,
            blocks: meta.blocks
        }));
    }

}

export default StorageSystem