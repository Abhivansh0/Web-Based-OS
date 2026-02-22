class StorageSystem {

    constructor(totalStorageKB, blockSizeKB) {
        this.totalKB = totalStorageKB
        this.blockSizeKB = blockSizeKB
        this.totalBlocks = Math.floor(this.totalKB / this.blockSizeKB)
        this.disk = new Array(this.totalBlocks).fill(null)
        // this.fileTable = {}
    }

    allocateStorage(blockCount){
        const freeBlocks = this.getFreeBlocksIndex()
        if (freeBlocks.length < blockCount) {
            return {success: false, error: "OUT_OF_STORAGE"}
        }

        const allocatedBlocks = freeBlocks.slice(0, blockCount)
        
        allocatedBlocks.forEach(index => {
            this.disk[index] = {payload: null}
        })
        return {success: true, blocks: allocatedBlocks}
    }

    deAllocateStorage(blockIndexes) {
        for(const index of blockIndexes){
            this.disk[index] = null
        }
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


    // listStorage() {
    //     return Object.entries(this.fileTable).map(([ownerID, meta]) => ({
    //         ownerID,
    //         blocks: meta.blocks
    //     }));
    // }

        // renamePath(oldPath, newPath){
    //     if (!this.fileTable[oldPath]) {
    //         return {success: false, error: "FILE_NOT_FOUND"}
    //     }
    //     if (this.fileTable[newPath]) {
    //         return {success: false, error: "ALREADY_EXIST"}
    //     }
    //     this.fileTable[newPath] = this.fileTable[oldPath]
    //     this.fileTable[newPath].blocks.forEach(index=>{
    //         this.disk[index] = newPath
    //     })

    //     delete this.fileTable[oldPath]
    //     return {success: true}
    // }

}

export default StorageSystem