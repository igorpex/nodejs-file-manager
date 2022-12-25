import { isAbsolute, normalize, join } from 'path';
import { checkPathIsAllowed } from './utils.js';
import { stat } from 'fs/promises';

/**
 * Given a new directory path (absolute or relative),
 * return result of working directory change and new worling directory path
 * @param {String} workingDirectory - Should be curent workingDirectory
 * @param {String} newPath - Should be new path(absolute or relative)
 * @returns {Boolean, String, String} - result and new Working directory path
 */

async function doNavigation(workingDirectory, newPath) {
    //Check if arguments are presented
    if (!newPath) {
        console.log('Input error');
        return
    };

    // Process relative and absolute paths
    let fullNewPath;
    if (isAbsolute(newPath)) {
        fullNewPath = normalize(newPath);
    } else {
        fullNewPath = join(workingDirectory, newPath);
    }

    // Check Path is allowed (in or below home directory)
    if (!checkPathIsAllowed(fullNewPath)) {
        console.log('Operation failed: Path is not allowed');
        return {
            result: false,
            newWorkingDirectory: workingDirectory,
            reason: 'Path is not allowed'
        }
    }

    // Check dest directory exist
    try {
        let destFileStat = await stat(fullNewPath);
        if (!destFileStat.isDirectory()) {
            console.log("Path is no not a dir or does not exist");
            return {
                result: false,
                newWorkingDirectory: fullNewPath,
                reason: 'Path is no not a dir or does not exist'
            }
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: destination directory does not exist");
            return
        } else {
            console.log("Operation failed");
        };
    };

    return {
        result: true,
        newWorkingDirectory: fullNewPath,
        reason: 'Ok!'
    }
}

export {
    doNavigation
};