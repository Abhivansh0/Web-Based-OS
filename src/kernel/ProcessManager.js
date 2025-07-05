class processManager {
    /**
 * @param {import('./MemoryManager.js').default} MemoryManager
 * @param {import('./Scheduler.js').default} Scheduler
 */
    constructor(MemoryManager, Scheduler) {
        this.Scheduler = Scheduler
        this.MemoryManager = MemoryManager;
        this.pidCounter = 0;
        this.processes = []
        this.readyQueue = [];
        this.waitingQueue = [];
        this.running = null
    }
    createProcess(ProcessName, size) {
        const pid = this.pidCounter++;
        if (this.Scheduler.getAvailableCPU() < 10) {
            return {success: false, error: "CPU_OVERLOAD" };
        }
        const {success, error} = this.MemoryManager.allocate(pid, size)
        if (!success) {
            return {success: false, error}
        }
        const process = {
            pid: pid,
            ProcessName: ProcessName,
            size: size,
            cpuUsage: 0,
            state: "ready"
        }
        this.processes.push(process)
        this.readyQueue.push(process);
        return {success: true, process};
    }

    contextSwitch() {
        if (this.running) {
            this.readyQueue.push(this.running)
            this.running.state = "ready"
        }
        this.running = this.readyQueue.shift() || null
    }

    blockRunningProcess() {
        if (this.running) {
            this.running.state = "waiting"
            this.waitingQueue.push(this.running)
            this.running = null
        }
    }
    unblockProcess(pid) {
        const index = this.waitingQueue.findIndex(p => p.pid === pid)
        if (index !== -1) {
            const proc = this.waitingQueue.splice(index, 1)[0]
            proc.state = "ready"
            this.readyQueue.push(proc)
        }
    }

    terminateProcess(pid) {
        const {success, error} = this.MemoryManager.freeMemory(pid)
        if(!success){
            return {success: false, error}
        }
        if (this.running && this.running.pid === pid) {
            this.Scheduler.releaseCpu(this.running.cpuUsage)
            this.running.cpuUsage = 0
            this.running = null
            return {success: true}
        }

        this.readyQueue = this.readyQueue.filter(p=>{
            if (p.pid === pid) {
                this.Scheduler.releaseCpu(p.cpuUsage)
                return false
            }
            return true
        })

        this.waitingQueue = this.waitingQueue.filter(p=> {
            if (p.pid === pid) {
                this.Scheduler.releaseCpu(p.cpuUsage)
                return false    
            }
            return true
        })

        this.processes = this.processes.filter(p => p.pid !== pid)
        return {success: true}
        
    }

    listProcesses() {
        return [
            ...this.readyQueue.map(p => ({ ...p, state: "ready" })),
            ...this.waitingQueue.map(p => ({ ...p, state: "waiting" })),
            ...(this.running ? [{ ...this.running, state: "running" }] : [])

        ]
    }
    getRunningProcess() {
        return this.running
    }
    getAllProcesses() {
        return this.processes;
    }

    getReadyQueue() {
        return this.readyQueue;
    }
    getWaitingQueue() {
        return this.waitingQueue;
    }
}
export default processManager