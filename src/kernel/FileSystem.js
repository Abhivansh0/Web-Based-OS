class FileSystem {
    /**
     * @param {import('./StorageSystem.js').default} StorageSystem 
     */

  constructor(StorageSystem) {
    this.ss = StorageSystem
    this.rootDirectory = {}; 
  }

  createFile(filePath, content = "") {
      const pathArray = filePath.split("/").filter(str => str !== "");
      const fileName = pathArray.pop();
      const directory = this.traversePath(pathArray);
      if (directory && !directory[fileName]) {
        const success = this.ss.allocateStorage(filePath, 1)
        if (!success) {
            return false;
        }
      directory[fileName] = { type: "File", content };
      return true
    }
}

readFile(filePath) {
    const pathArray = filePath.split("/").filter(str => str !== "");
    const fileName = pathArray.pop();
    const directory = this.traversePath(pathArray);
    return directory?.[fileName]?.content || null;
}

deleteFile(filePath) {
    const pathArray = filePath.split("/").filter(str => str !== "");
    const fileName = pathArray.pop();
    const directory = this.traversePath(pathArray);
    if (directory && directory[fileName]) {
        this.ss.deAllocateStorage(filePath)
        delete directory[fileName];
    }
}

writeFile(filePath, content){
    const pathArray = filePath.split("/").filter(str => str !== "")
    const fileName = pathArray.pop();
    const directory = this.traversePath(pathArray)

    if (directory && directory[fileName]) {
        const sizeKB = Math.ceil(content.length / 1024)

        this.ss.deAllocateStorage(filePath)

        const success = this.ss.allocateStorage(filePath, sizeKB)
        if (!success) {
            return false
        }
        
        directory[fileName].content = content
        return true
    }
    return false
}

renameFile(oldPath, newName) {
    const pathArray = oldPath.split("/").filter(str => str !== "");
    const oldName = pathArray.pop();
    const directory = this.traversePath(pathArray);
    if (directory && directory[oldName]) {
        directory[newName] = directory[oldName];
        delete directory[oldName];
    }
}
traversePath(pathArray) {
  let current = this.rootDirectory;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const folder = pathArray[i];
    if (!current[folder]) {
      return null;
    }
    if (current[folder].children) {
      current = current[folder].children;
    } else {
      current = current[folder];
    }
  }
  return current;
}
listDirectory(path = "/") {
    const pathArray = path.split("/").filter(str => str !== "");
    const directory = this.traversePath(pathArray) || this.rootDirectory;
    
    return Object.entries(directory).map(([name, item]) => ({
        name,
        type: item.type
    }));
}
}
export default FileSystem;
