import ProcessManager from "../kernel/ProcessManager";
import MemoryManager from "../kernel/MemoryManager";
import Scheduler from "../kernel/Scheduler";
import StorageSystem from "../kernel/StorageSystem"

const osMemoryManager = new MemoryManager(2048)
const osStorageSystem = new StorageSystem
const osProcessManager = new ProcessManager(osMemoryManager)
const osScheduler = new Scheduler(osProcessManager)
osScheduler.startScheduler()
