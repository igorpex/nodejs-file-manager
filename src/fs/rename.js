// import * as fs from 'fs/promises';
import { stat, rename } from 'fs/promises';
// import { rename } from 'fs';
import { isAbsolute, normalize, join, dirname, resolve } from 'path';
import { getDirname, checkPathIsAllowed } from '../utils.js';
const __dirname = getDirname(import.meta.url);

const rn = async (workingDirectory, pathToFile, newFilename) => {

    //Check if arguments are presented
    if (!pathToFile || !newFilename) {
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

    const newFilepath = join(dirname(fullPathToFile), newFilename);

    try {
        let newFileStat = await stat(newFilepath);
        if (newFileStat.isFile()) {
            console.log("Operation failed: new filename already exists");
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            // console.log(e);
        } else {
            console.log("Operation failed");
        };
    };

    try {
        let oldFileStat = await stat(fullPathToFile);
        if (oldFileStat.isFile()) {
            return
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: path to file does not exist");
            return
        }
    };

    try {
        await rename(fullPathToFile, newFilepath);
    } catch (e) {
        console.log('Operation failed on renaming');
        return
    }
};

export {
    rn
}