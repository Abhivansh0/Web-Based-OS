class processManager{
    constructor(MemoryManager){
        this.processes=[];
        this.ReadyQueue=[];
        this.PidCounter=0;
        this.MemoryManager=MemoryManager;
        this.RunningQueue=[];
        this.WaitingQueue=[];
        this.running = null
    }
    CreateProcess(ProcessName,size){
        const pid= this.PidCounter++;
        const success = this.MemoryManager.allocate(pid,size)
        if(!success){
            return null;
        }
        const process = {
            pid : pid ,
            ProcessName : ProcessName ,
            size : size ,
            CpuUSage : 0,
            state:"ready"
        }
        this.processes.push(process);
        this.ReadyQueue.push(process);
        return process;
    }
    ListProcess(){
        return this.processes.map(function(p) {
            return {
                PID: p.pid,
                Name: p.name,
                Size: p.size,
                State: p.state 
            };
        });
    }
    terminateProcess(pid) {
         const index = this.processes.findIndex(p => p.pid === pid);
         if (index !== -1) {
             this.MemoryManager.freeMemory(pid);
             this.processes.splice(index, 1);
             // console.log(` Process with PID ${pid} terminated.`);
        }
        const ReadyIndex = this.ReadyQueue.findIndex(p => p.pid === pid);
            if (ReadyIndex !== -1) this.ReadyQueue.splice(ReadyIndex, 1);
            const WaitingIndex = this.WaitingQueue.findIndex(p => p.pid === pid);
            if (WaitingIndex !== -1) this.WaitingQueue.splice(WaitingIndex, 1);
    }
    MoveToRunning(pid) {
        const index = this.ReadyQueue.findIndex(p => p.pid === pid);
        if (index !== -1) {
            const [proc] = this.ReadyQueue.splice(index, 1);
            proc.state = "running";
            this.RunningQueue.push(proc);
        }
    }
    
    
    MoveToReady(pid) {
        const index = this.RunningQueue.findIndex(p => p.pid === pid);
        if (index !== -1) {
            const [proc] = this.RunningQueue.splice(index, 1);
            proc.state = "ready";
            this.ReadyQueue.push(proc);
        }
    }
    MoveToWaiting(pid) {
    const index = this.RunningQueue.findIndex(p => p.pid === pid);
    if (index !== -1) {
        const [proc] = this.RunningQueue.splice(index, 1);
        proc.state = "waiting";
        proc.cpuUsage = 0;
        this.WaitingQueue.push(proc);
    }
}
    GetReadyQueue(){
        return this.ReadyQueue;
    }
    GetRunningQueue(){
        return this.RunningQueue;
    }
    GetWaitingQueue(){
        return this.WaitingQueue;
    }
}

    




































// class ProcessManager{
    
//     constructor(memoryManager){
//         this.processes = [];
//         this.pidCounter = 0;   
//         this.memoryManager = memoryManager;
//     }
//     createProcess(processName,size){
//         const pid = this.pidCounter++;
//         const success = this.memoryManager.allocate(pid, size);
//          // const exists = this.processes.some(p => p.pid === pid);
//         if (exists) {
//         // console.warn(`Process with PID ${pid} already exists.`);
//         return null;
//     }

        
//         if (!success){
//             // console.log(`${processName} with ID ${pid} and ${size}MB cannot be run due to Insufficient Memory`);
//             return null;
//         }
        
        
//         const process = new process(pid, processName, size);
//         this.processes.push(process);
//         // console.log(` Process "${processName}" created with PID ${pid} & size ${size} MB`);
//         return process;
//    }
//    listProcesses(){
//     return this.processes.map(function(p) {
//         return {
//             PID: p.pid,
//             Name: p.name,
//             Size: p.size,
//             State: p.state 
//         };
//     });
//    }
// }
