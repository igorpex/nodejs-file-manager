import { createReadStream, createWriteStream } from 'fs';
import { isAbsolute, normalize, join, dirname, basename, resolve } from 'path';
import { checkPathIsAllowed } from '../utils.js';
import { stat } from 'fs/promises';
import * as path from 'path';
import * as zlib from 'zlib';
import { pipeline } from 'stream';

export const compress = async (workingDirectory, pathToFile, pathToNewFile) => {
    //Check if arguments are presented
    if (!pathToFile || !pathToNewFile) {
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

    let fullPathToNewFile;
    if (isAbsolute(pathToNewFile)) {
        fullPathToNewFile = normalize(pathToNewFile);
    } else {
        fullPathToNewFile = join(workingDirectory, pathToNewFile);
    }

    // Check Path is allowed (in or below home directory)
    if (!checkPathIsAllowed(fullPathToFile)) {
        console.log('Operation failed: Path is not allowed');
        return
    }

    if (!checkPathIsAllowed(fullPathToNewFile)) {
        console.log('Operation failed: Path is not allowed');
        return
    }

    // Check dest file does not exist
    try {
        let destFileStat = await stat(fullPathToNewFile);
        if (destFileStat.isFile()) {
            console.log("Operation failed: destination file already exists");
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            // console.log(e);
        } else {
            console.log("Operation failed ");
        };
    };

    // Check dest directory exist
    try {
        let destFileStat = await stat(dirname(fullPathToNewFile));
        if (!destFileStat.isDirectory()) {
            console.log("Operation failed: destination directory does not exist");
            return
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log("Operation failed: destination directory does not exist");
            return
        } else {
            console.log("Operation failed");
        };
    };

    // Check source is file, not directory
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
        }
    };

    // Compress
    const input = createReadStream(fullPathToFile);
    const output = createWriteStream(fullPathToNewFile);
    const gzip = zlib.createBrotliCompress();
    pipeline(
        input,
        gzip,
        output,
        e => {
            if (e) {
                console.log("Operation failed");
            }
        }
    );
};
