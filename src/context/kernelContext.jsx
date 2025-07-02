import ProcessManager from "../kernel/ProcessManager";
import MemoryManager from "../kernel/MemoryManager";
import Scheduler from "../kernel/Scheduler";

const osMemoryManager = new MemoryManager(2048)
const osProcessManager = new ProcessManager(osMemoryManager)
const osScheduler = new Scheduler(osProcessManager)
osScheduler.startScheduler()
