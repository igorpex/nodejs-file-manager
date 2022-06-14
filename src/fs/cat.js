import * as fs from 'fs';
import { isAbsolute, normalize, join } from 'path';
import { getDirname, checkPathIsAllowed } from '../utils.js';
const __dirname = getDirname(import.meta.url);

export const cat = async (workingDirectory, pathToFile) => {
  if (!pathToFile) {
    console.log('Input error');
    return
  };
  let fullFilePath;
  if (isAbsolute(pathToFile)) {
    fullFilePath = normalize(pathToFile);
  } else {
    fullFilePath = join(workingDirectory, pathToFile);
  }

  if (!checkPathIsAllowed(fullFilePath)) {
    console.log('Operation failed: Path is not allowed');
    return
  }

  const { stdout } = process;
  try {
    const stream = fs.createReadStream(fullFilePath, 'utf-8');
    stream.on('data', chunk => stdout.write(chunk));
    stream.on('error', () => console.log('Operation failed'))
  } catch (error) {
    console.log('Operation failed');
  }

};