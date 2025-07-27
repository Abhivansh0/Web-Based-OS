class FileSystem {
    /**
     * @param {import('./StorageSystem.js').default} StorageSystem 
     */

    constructor(StorageSystem) {
        this.ss = StorageSystem
        this.rootDirectory = {
            apps: {
                type: "Folder",
                children: {}
            },
            files: {
                type: "Folder",
                children: {}
            }
        };
    }

    getItemCaseInsensitive(directory, itemName) {
        const lowerName = itemName.toLowerCase();
        for (const key in directory) {
            if (key.toLowerCase() === lowerName) {
                return [key, directory[key]];
            }
        }
        return null;
    }

    uniqueName(directory, baseName, extension = "") {
        let counter = 1;
        let newName = `${baseName}[${counter}]${extension}`;
        while (this.getItemCaseInsensitive(directory, newName)) {
            counter++;
            newName = `${baseName}[${counter}]${extension}`;
        }
        return newName;
    }

    createFile(filePath, content = "") {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const fileName = pathArray.pop();
        const directory = this.traversePath(pathArray);
        if (directory && !directory[fileName]) {
            const { success, error } = this.ss.allocateStorage(filePath, 1)
            if (!success) {
                return { success: false, error };
            }
            directory[fileName] = { type: "File", content };
            return { success: true }
        }
        return { success: false, error: "ALREADY_EXIST" }
    }

    createFolder(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const folderName = pathArray.pop()
        const directory = this.traversePath(pathArray)
        if (directory && !directory[folderName]) {
            directory[folderName] = { type: "Folder", children: {} }
            return { success: true }
        }

        return { success: false, error: "ALREADY_EXIST" }
    }

    deleteFolder(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const folderName = pathArray.pop();
        const directory = this.traversePath(pathArray);
        if (directory && directory[folderName] && directory[folderName].type === "Folder") {
            const children = directory[folderName].children

            const fileNames = Object.keys(children)

            fileNames.forEach(child => {
                const item = children[child]
                if (item.type === "File") {
                    const fullPath = `${filePath}/${child}`
                    this.ss.deAllocateStorage(fullPath)
                }
                else if (item.type === "Folder") {
                    const folderPath = `${filePath}/${child}`
                    this.deleteFolder(folderPath)
                }
            })
            delete directory[folderName];
            return { success: true }
        }
        return { success: false, error: "FILE_DONT_EXIST" }
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
            return { success: true }
        }
        return { success: false, error: "FILE_DONT_EXIST" }
    }

    moveToFile(oldPath, newPath) {
        const pathArray = oldPath.split("/").filter(str => str !== "")
        const fileName = pathArray.pop()
        const directory = this.traversePath(pathArray)

        if (!directory[fileName] || directory[fileName].type !== "File") {
            return { success: false, error: "FILE_NOT_FOUND" }
        }

        const content = directory[fileName].content

        const newArrayPath = newPath.split("/").filter(str => str !== "")
        const newDirectoy = this.traversePath(newArrayPath)

        if (!newDirectoy || newDirectoy[fileName]) {
            return { success: false, error: "ALREADY_EXIST" }
        }

        const { success, error } = this.ss.renamePath(oldPath, newPath)
        if (!success) {
            return { success: false, error }
        }

        newDirectoy[fileName] = { type: "File", content: content }
        delete directory[fileName]

        return { success: true }

    }

    writeFile(filePath, content) {
        const pathArray = filePath.split("/").filter(str => str !== "")
        const fileName = pathArray.pop();
        const directory = this.traversePath(pathArray)

        if (directory && directory[fileName] && directory[fileName].type === "File") {
            const sizeKB = Math.ceil(content.length / 1024)

            this.ss.deAllocateStorage(filePath)

            const { success, error } = this.ss.allocateStorage(filePath, sizeKB)
            if (!success) {
                return { success: false, error }
            }

            directory[fileName].content = content
            return { success: true }
        }
        return { success: false, error: "FILE_DONT_EXIST" }
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
            if (current[folder].type === "Folder" && current[folder].children) {
                current = current[folder].children;
            } else {
                return null
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
