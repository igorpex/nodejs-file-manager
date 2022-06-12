import { stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import { isAbsolute, normalize, join, resolve } from 'path';
import { getDirname, checkPathIsAllowed } from '../utils.js';

export const add = async (workingDirectory, filePath) => {

    //Check if arguments are presented
    if (!filePath) {
        console.log('Input error');
        return
    };

    // Process relative and absolute paths
    let fullFilePath;
    if (isAbsolute(filePath)) {
        fullFilePath = normalize(filePath);
    } else {
        fullFilePath = join(workingDirectory, filePath);
    }

    // Check filePath is allowed (in or below home directory)
    if (!checkPathIsAllowed(fullFilePath)) {
        console.log('Operation failed: Path is not allowed');
        return
    }

    // Check dest file does not exist
    const checkIfFileExist = async () => {
        try {
            let newFileStat = await stat(fullFilePath);
            if (newFileStat.isFile()) {
                console.log('Operation failed');
                resolve;
                return;
            }
        } catch (e) {
            if (e.code !== 'ENOENT') {
                console.log('Operation failed');
                return
            }
        };
    };

    // Add file operation itself
    const addFile = () => {
        const file = createWriteStream(fullFilePath, 'utf-8');
        file.close();
    }

    await checkIfFileExist();
    addFile();
}
