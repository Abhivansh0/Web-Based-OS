class MemoryManager {
    constructor(totalMemory) {
        this.total = totalMemory
        this.available = totalMemory
        this.used = 0
        this.blocks = [
            { pid: null, start: 0, size: totalMemory }
        ]
    }

    allocate(pid, size) {
        for(let i = 0; i< this.blocks.length; i++){
            if (this.blocks[i].pid === pid) {
                return null
            }
        }

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i]
            if (block.pid === null && block.size >= size) {
                const usedBlock = { pid: pid, start: block.start, size: size }
                const remaining = block.size - size

                if (remaining > 0) {
                    const freeBlock = { pid: null, start: block.start + size, size: remaining }
                    this.blocks.splice(i, 1, usedBlock, freeBlock)
                }
                else {
                    this.blocks[i] = usedBlock
                }
                this.available = this.available - size
                this.used = this.used + size
                return true;

            }
        }
        return false
    }
    freeMemory(pid) {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i]
            if (block.pid === pid) {
                block.pid = null;
                this.available = this.available + block.size
                this.used = this.used - block.size
                this.mergeFreeSpace()
                return;
            }
        }
    }

    mergeFreeSpace() {
        let i = 0;
        while (i < this.blocks.length - 1) {
            if (this.blocks[i].pid === null && this.blocks[i + 1].pid === null) {
                this.blocks[i].size += this.blocks[i + 1].size;
                this.blocks.splice(i + 1, 1); 
            } else {
                i++;
            }
        }
    }
    getMemoryState(){
        return this.blocks;
    }

    getMemoryInUse() {
        return this.used
    }
    getAvailableMemory() {
        return this.available
    }
}

export default MemoryManager;



