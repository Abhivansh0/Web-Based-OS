class Scheduler{

/**
 * @param {import('./ProcessManager').default} processManager
 */

    constructor(processManager){
        this.totalCPU = 100
        this.usedCPU = 5
        this.availableCPU = this.totalCPU - this.usedCPU
        this.pm = processManager
        this.current = 0
    }

    startScheduler(time = 2000){
        setInterval(() => {
            const list = this.pm.listProcesses();
            if (!list.length) {
                return null
            }
            this.usedCPU = 5

            list.forEach(p => {
                
                if (p.state !== "running") {
                    p.cpuUsage = Math.max(p.cpuUsage - 10, 0)   
                }
                this.usedCPU += p.cpuUsage
                p.state = "ready"
            });

            this.availableCPU = this.totalCPU - this.usedCPU

            const currentIndex = this.current % list.length
            const runningProcess = list[currentIndex]
            runningProcess.state = "running"

            const maxUsable = Math.min(50, this.availableCPU)
            const assignedCPU = Math.floor(Math.random() * Math.min(30, maxUsable)) + 20
            runningProcess.cpuUsage = Math.min(assignedCPU, this.availableCPU)

            this.usedCPU += runningProcess.cpuUsage;
            this.availableCPU = this.totalCPU - this.usedCPU


            this.current++
            
        }, time);
    }

    getAvailableCPU(){
        return this.availableCPU
    }
    getUsedCPU(){
        return this.usedCPU
    }
}

export default Scheduler