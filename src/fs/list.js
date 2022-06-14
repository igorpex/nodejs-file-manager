import { readdir } from 'fs/promises';

/**
 * prints files and folders names to console
 * @param {String} workingDirectory - should be directory name
 */

export const list = async (workingDirectory) => {
  const dirPath = workingDirectory;
  try {
    const list = await readdir(dirPath, { withFileTypes: true });
    const files = list
      .filter(dirent => dirent.isFile())
      .map(file => file.name);
    const folders = list
      .filter(dirent => dirent.isDirectory())
      .map(dir => dir.name);

    console.log('\x1b[36m', 'FILES:', '\x1b[0m')
    files.forEach(name => console.log('\x1b[32m', name, '\x1b[0m'));
    console.log('\x1b[36m', 'FOLDERS:', '\x1b[0m')
    folders.forEach(name => console.log('\x1b[42m', name, '\x1b[40m'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error("Operation failed: no such directory");
    } else console.log(e);
  }
};
