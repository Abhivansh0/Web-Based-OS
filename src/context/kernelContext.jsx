import ProcessManager from "../kernel/ProcessManager";
import MemoryManager from "../kernel/MemoryManager";
import Scheduler from "../kernel/Scheduler";
import StorageSystem from "../kernel/StorageSystem"
import FileSystem from "../kernel/FileSystem"

const osMemoryManager = new MemoryManager(2048)
const osStorageSystem = new StorageSystem
const osProcessManager = new ProcessManager(osMemoryManager, osScheduler)
const osScheduler = new Scheduler(osProcessManager)
const osFileSystem = new FileSystem(osStorageSystem)
osScheduler.startScheduler()
