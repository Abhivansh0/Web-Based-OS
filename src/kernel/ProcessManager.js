class ProcessManager{
    
    constructor(memoryManager){
        this.processes = [];
        this.pidCounter = 0;   
        this.memoryManager = memoryManager;
    }
    createProcess(processName,size){
        const pid = this.pidCounter++;
        const success = this.memoryManager.allocate(pid, size);
            const exists = this.processes.some(p => p.pid === pid);
        if (exists) {
        console.warn(`Process with PID ${pid} already exists.`);
        return null;
    }

        
        if (!success){
            console.log(`${processName} with ID ${pid} and ${size}MB cannot be run due to Insufficient Memory`);
            return null;
        }
        
        
        const process = new process(pid, processName, size);
        this.processes.push(process);
        console.log(` Process "${processName}" created with PID ${pid} & size ${size} MB`);
        return process;
   }
   listProcesses(){
    return this.processes.map(function(p) {
        return {
            PID: p.pid,
            Name: p.name,
            Size: p.size,
        // State: p.state
        };
    });
   }
   terminateProcess(pid) {
        const index = this.processes.findIndex(p => p.pid === pid);
        if (index !== -1) {
            this.memoryManager.freeMemory(pid);
            this.processes.splice(index, 1);
            console.log(` Process with PID ${pid} terminated.`);
        }
    }
}