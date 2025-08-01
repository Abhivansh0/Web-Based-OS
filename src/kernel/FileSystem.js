class FileSystem {
    /**
     * @param {import('./StorageSystem.js').default} storageSystem 
     */

    constructor(storageSystem) {
        this.ss = storageSystem;
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

    uniqueName(baseName, extension = "") {
        const nameExists = (dir) => {
            for (const key in dir) {
                if (key.toLowerCase() === `${newName}`.toLowerCase()) {
                    return true;
                }
                const item = dir[key];
                if (item.type === "Folder") {
                    if (nameExists(item.children)) return true;
                }
            }
            return false;
        };

        let counter = 0;
        let newName = `${baseName}${extension}`;
        while (nameExists(this.rootDirectory)) {
            counter++;
            newName = `${baseName}[${counter}]${extension}`;
        }

        return newName;
    }


    createFile(filePath, content = "") {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const fileName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const existing = this.getItemCaseInsensitive(directory, fileName);
        if (directory && !existing) {
            const { success, error } = this.ss.allocateStorage(filePath, 1);
            if (!success) {
                return { success: false, error };
            }
            directory[fileName] = { type: "File", content };
            return { success: true };
        }
        return { success: false, error: "ALREADY_EXIST" };
    }

    createFolder(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const folderName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const existing = this.getItemCaseInsensitive(directory, folderName);
        if (directory && !existing) {
            directory[folderName] = { type: "Folder", children: {} };
            return { success: true };
        }

        return { success: false, error: "ALREADY_EXIST" };
    }

    deleteFolder(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const folderName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const entry = this.getItemCaseInsensitive(directory, folderName);
        if (entry && entry[1].type === "Folder") {
            const children = entry[1].children;
            const fileNames = Object.keys(children);

            fileNames.forEach(child => {
                const item = children[child];
                const fullPath = `${filePath}/${child}`;
                if (item.type === "File") {
                    this.ss.deAllocateStorage(fullPath);
                } else if (item.type === "Folder") {
                    this.deleteFolder(fullPath);
                }
            });

            const [actualFolderName] = entry;
            delete directory[actualFolderName];
            return { success: true };
        }
        return { success: false, error: "FILE_DONT_EXIST" };
    }

    readFile(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const fileName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const entry = this.getItemCaseInsensitive(directory, fileName);
        return entry?.[1]?.type === "File" ? entry[1].content : null;
    }

    deleteFile(filePath) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const fileName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const entry = this.getItemCaseInsensitive(directory, fileName);
        if (entry && entry[1].type === "File") {
            this.ss.deAllocateStorage(filePath);
            const [actualFileName] = entry;
            delete directory[actualFileName];
            return { success: true };
        }
        return { success: false, error: "FILE_DONT_EXIST" };

    }
    moveToFile(oldPath, newPath) {
        const pathArray = oldPath.split("/").filter(str => str !== "")
        const fileName = pathArray.pop()
        const directory = this.traversePathCaseInsensitive(pathArray)

        if (!directory[fileName] || directory[fileName].type !== "File") {
            return { success: false, error: "FILE_NOT_FOUND" }
        }

        const content = directory[fileName].content

        const newArrayPath = newPath.split("/").filter(str => str !== "")
        const newDirectoy = this.traversePathCaseInsensitive(newArrayPath)

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

    moveFolder(oldPath, newPath) {
        const oldPathArray = oldPath.split("/").filter(str => str !== "");
        const folderName = oldPathArray.pop();
        const sourceDir = this.traversePathCaseInsensitive(oldPathArray);

        const folderToMove = sourceDir?.[folderName];
        if (!sourceDir || !folderToMove || folderToMove.type !== "Folder") {
            return { success: false, error: "FOLDER_NOT_FOUND" };
        }

        const newPathArray = newPath.split("/").filter(str => str !== "");
        const destDir = this.traversePathCaseInsensitive(newPathArray);

        if (!destDir) {
            return { success: false, error: "DESTINATION_NOT_FOUND" };
        }

        destDir[folderName] = { type: "Folder", children: {} };

        const moveChildren = (src, dest) => {
            for (const key in src) {
                const item = src[key];
                if (item.type === "File") {
                    dest[key] = { ...item };
                } else if (item.type === "Folder") {
                    dest[key] = { type: "Folder", children: {} };
                    moveChildren(item.children, dest[key].children);
                }
            }
        };

        moveChildren(folderToMove.children, destDir[folderName].children);
        delete sourceDir[folderName];

        return { success: true };
    }


    writeFile(filePath, content) {
        const pathArray = filePath.split("/").filter(str => str !== "");
        const fileName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const entry = this.getItemCaseInsensitive(directory, fileName);

        if (entry && entry[1].type === "File") {
            const sizeKB = Math.ceil(content.length / 1024);
            this.ss.deAllocateStorage(filePath);
            const { success, error } = this.ss.allocateStorage(filePath, sizeKB);
            if (!success) {
                return { success: false, error };
            }
            entry[1].content = content;
            return { success: true };
        }
        return { success: false, error: "FILE_DONT_EXIST" };
    }

    renameFile(oldPath, newName) {
        const pathArray = oldPath.split("/").filter(str => str !== "");
        const oldName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const oldEntry = this.getItemCaseInsensitive(directory, oldName);
        const newEntry = this.getItemCaseInsensitive(directory, newName);
        if (!oldEntry) return { success: false, error: "FILE_NOT_FOUND" };
        if (newEntry) return { success: false, error: "NEW_NAME_EXISTS" };

        const [actualOldName, value] = oldEntry;

        const oldFullPath = [...pathArray, actualOldName].join("/");
        const newFullPath = [...pathArray, newName].join("/");
        this.ss.deAllocateStorage(oldFullPath);
        const { success, error } = this.ss.allocateStorage(newFullPath, 1);
        if (!success) return { success: false, error };

        directory[newName] = value;
        delete directory[actualOldName];
        return { success: true };
    }
    renameFolder(oldPath, newName) {
        const pathArray = oldPath.split("/").filter(str => str !== "");
        const oldName = pathArray.pop();
        const directory = this.traversePathCaseInsensitive(pathArray);
        const oldEntry = this.getItemCaseInsensitive(directory, oldName);
        const newEntry = this.getItemCaseInsensitive(directory, newName);
        if (!oldEntry || oldEntry[1].type !== "Folder") return { success: false, error: "FOLDER_NOT_FOUND" };
        if (newEntry) return { success: false, error: "NEW_NAME_EXISTS" };

        const [actualOldName, value] = oldEntry;
        directory[newName] = value;
        delete directory[actualOldName];
        return { success: true };
    }


    traversePathCaseInsensitive(pathArray) {
        let current = this.rootDirectory;
        for (const segment of pathArray) {
            const entry = this.getItemCaseInsensitive(current, segment);
            if (!entry || entry[1].type !== "Folder") return null;
            current = entry[1].children;
        }
        return current;
    }

    listDirectory(path = "/") {
        const pathArray = path.split("/").filter(str => str !== "");
        const directory = this.traversePathCaseInsensitive(pathArray) || this.rootDirectory;

        return Object.entries(directory).map(([name, item]) => ({
            name,
            type: item.type
        }));
    }
}

export default FileSystem;
