import ProcessManager from "../kernel/ProcessManager";
import MemoryManager from "../kernel/MemoryManager";
import Scheduler from "../kernel/Scheduler";
import StorageSystem from "../kernel/StorageSystem"
import FileSystem from "../kernel/FileSystem"
import { createContext, useContext, useRef } from "react";

const kernelContext = createContext(null)

export const KernelProvider = ({ children }) => {
    const kernel = useRef(null)

    if (!kernel.current) {
        const memoryManager = new MemoryManager(4194304)
        const scheduler = new Scheduler()
        const processManager = new ProcessManager(memoryManager, scheduler)
        scheduler.pm = processManager
        const storageSystem = new StorageSystem(16777216, 4)
        const fileSystem = new FileSystem(storageSystem)

        scheduler.startScheduler()


        kernel.current = {
            memoryManager,
            processManager,
            scheduler,
            storageSystem,
            fileSystem
        }
    }
    return (
        <kernelContext.Provider value={kernel.current} >
            {children}
        </kernelContext.Provider>
    )
}

export const useKernel = () => {
    const kernel = useContext(kernelContext)
    if (!kernel) {
        alert("useKernel must be used within a kernelProvider")
    }

    /** @type {import('../kernel/MemoryManager').default} */
    const memoryManager = kernel.memoryManager;

    /** @type {import('../kernel/ProcessManager').default} */
    const processManager = kernel.processManager;

    /** @type {import('../kernel/Scheduler').default} */
    const scheduler = kernel.scheduler;

    /** @type {import('../kernel/StorageSystem').default} */
    const storageSystem = kernel.storageSystem;

    /** @type {import('../kernel/FileSystem').default} */
    const fileSystem = kernel.fileSystem;

    const createApp = (appName, size) => {
        const {success, process, error} = processManager.createProcess(appName, size)
        if (!success) {
            return {success: false, error}     
        }
        return {success: true, process}
    }

    const terminateApp = (pid) => {
        const {success, error} = processManager.terminateProcess(pid)
        if (!success) {
          return {success: false, error}  
        }
        return {success: true}
    }

    const getProcessStats = ()=>{
        return {
            running: processManager.getRunningProcess(),
            all : processManager.getAllProcesses(),
            ready: processManager.getReadyQueue(),
            waiting: processManager.getWaitingQueue()
        }
    }

    const getSystemStats = ()=> {
        return {
            AvailableCPU : scheduler.getAvailableCPU(),
            AvailableMemory : memoryManager.getAvailableMemory(),
            UsedCPU : scheduler.getUsedCPU(),
            UsedMemory : memoryManager.getMemoryInUse()
        }
    }

    return {
        createApp,
        terminateApp,
        getProcessStats,
        getSystemStats,
        memoryManager, 
        processManager,
        scheduler,
        storageSystem,
        fileSystem
    }

}
