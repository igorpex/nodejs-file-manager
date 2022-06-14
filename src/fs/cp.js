// import * as fs from 'fs/promises';
import { stat, rename } from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import { isAbsolute, normalize, join, dirname, basename, resolve } from 'path';
import { getDirname, checkPathIsAllowed } from '../utils.js';
const __dirname = getDirname(import.meta.url);

/**
* cp - copies file using streams
 * @param {String} workingDirectory - current working directory, to work with relative paths.
 * @param {String} pathToFile - should be path to source file.
 * @param {String} pathToNewDir - should be path to destination directory.
 */

export const cp = async (workingDirectory, pathToFile, pathToNewDir) => {

  //Check if arguments are presented
  if (!pathToFile || !pathToNewDir) {
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

  let fullPathToNewDir;
  if (isAbsolute(pathToNewDir)) {
    fullPathToNewDir = normalize(pathToNewDir);
  } else {
    fullPathToNewDir = join(workingDirectory, pathToNewDir);
  }

  // Check Path is allowed (in or below home directory)
  if (!checkPathIsAllowed(fullPathToFile)) {
    console.log('Operation failed: Path is not allowed');
    return
  }

  if (!checkPathIsAllowed(fullPathToNewDir)) {
    console.log('Operation failed: Path is not allowed');
    return
  }

  const pathToNewFile = join(fullPathToNewDir, basename(fullPathToFile));

  // Check dest file does not exist
  try {
    let destFileStat = await stat(pathToNewFile);
    if (destFileStat.isFile()) {
      console.log("Operation failed: destination file already exists");
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      // console.log(e);
    } else {
      console.log("Operation failed");
    };
  };

  // Check dest directory exist
  try {
    let destFileStat = await stat(dirname(pathToNewFile));
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


  // Copy using streams
  const alternateCopy = async (source, dest) => {
    // use stream pipe to reduce memory usage
    const writeFileStream = createWriteStream(dest);
    const readFileStream = createReadStream(source).pipe(writeFileStream);

    return new Promise(function (resolve, reject) {
      writeFileStream.on('finish', resolve);
      readFileStream.on('error', reject);
    });
  };

  try {
    await alternateCopy(fullPathToFile, pathToNewFile);
    return { 'result': true }
  } catch (e) {
    console.log('Operation failed on copying');
    return
  }
};

