
import { stat, rename, rm, unlink } from 'fs/promises';
import { isAbsolute, normalize, join, dirname, basename, resolve } from 'path';
import { getDirname, checkPathIsAllowed } from '../utils.js';
const __dirname = getDirname(import.meta.url);

export const remove = async (workingDirectory, pathToFile) => {

    //Check if arguments are presented
    if (!pathToFile) {
        console.log('Input error');
        return
    };

    // Process relative and absolute paths
    let fullPathToFile;
    if (isAbsolute(pathToFile)) {
        fullPathToFile = normalize(pathToFile);
    } else {
        fullPathToFile = join(workingDirectory, pathToFile);
    }

    // Check Path is allowed (in or below home directory)
    if (!checkPathIsAllowed(fullPathToFile)) {
        console.log('Operation failed: Path is not allowed');
        return
    }

    try {
        // await rm(fullPathToFile);
        await unlink(fullPathToFile);
        return
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: no such file");
            return
        } else {
            console.log("Operation failed");
        }
    }
};