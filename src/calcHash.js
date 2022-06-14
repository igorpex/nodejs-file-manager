import fs from 'fs/promises';
import { stat, rename } from 'fs/promises';
import crypto from 'crypto';
import { isAbsolute, normalize, join } from 'path';
import { checkPathIsAllowed } from './utils.js';

/**
 * calculates SHA256 hash for the given file and print it as a hex
 * @param {String} pathToFile - should be path to file
 */
export const calculateHash = async (workingDirectory, pathToFile) => {

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

    // Check path is allowed (in or below home directory)
    if (!checkPathIsAllowed(fullPathToFile)) {
        console.log('Operation failed: Path is not allowed');
        return
    }

    // Check path leads to file and it does exist
    try {
        let srcFileStat = await stat(fullPathToFile);
        if (srcFileStat.isDirectory()) {
            console.log("Operation failed: source is directory, not file");
            return
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: path to source file does not exist");
            return
        } else {
            console.log("Operation failed");
        }
    };

    try {
        const fileBuffer = await fs.readFile(fullPathToFile);
        const hash = crypto.createHash('sha256');
        hash.update(fileBuffer);
        const hexHash = hash.digest('hex');
        console.log(hexHash);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: file not found");
        } else {
            console.log("Operation failed");
        }
    }
};


