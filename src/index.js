import { parseArgs } from './args.js';
import os from 'os';
import { getDirname } from './utils.js';
import { operations } from './operations.js';
import { doNavigation } from './navigation.js';
import { list } from './fs/list.js';
import { cat } from './fs/cat.js';
import { add } from './fs/add.js';
import { rn } from './fs/rename.js';
import { cp } from './fs/cp.js';
import { remove } from './fs/remove.js';
import { calculateHash } from './calcHash.js';
import { compress } from './zip/compress.js';
import { decompress } from './zip/decompress.js';

const __dirname = getDirname(import.meta.url);
const homeDir = os.homedir();
let workingDirectory = homeDir;

const userName = parseArgs()['username'];

const { stdin, stdout } = process;

stdout.write(`Welcome to the File Manager, ${userName}! Введите "exit" или нажмите Ctrl+C для окончания записи.\n`);
stdout.write(`You are currently in ${workingDirectory}\n`);

stdin.on('data', async (chunk) => {
  if (chunk.toString().trim() === '.exit') {
    handleExit();
  }
  let command = chunk.toString().trim();
  let operation = command.split(' ')[0];
  let operationArgs = command.split(' ').slice(1);

  if (!operations.hasOwnProperty(operation)) {
    stdout.write(`Invalid input\n`);
    stdout.write(`You are currently in ${workingDirectory}\n`);

  } else if (operation === 'up') {
    const navigation = await doNavigation(workingDirectory, '..');
    workingDirectory = navigation['newWorkingDirectory'];

  } else if (operation === 'cd') {
    // cd path_to_directory
    const navigation = await doNavigation(workingDirectory, operationArgs[0]);
    const newWorkingDirectory = navigation['newWorkingDirectory'];
    workingDirectory = newWorkingDirectory;

  } else if (operation === 'ls') {
    await list(workingDirectory);

  } else if (operation === 'cat') {
    // cat path_to_file
    await cat(workingDirectory, operationArgs[0]);

  } else if (operation === 'add') {
    //add new_file_name
    await add(workingDirectory, operationArgs[0]);

  } else if (operation === 'rn') {
    //rn path_to_file new_filename
    await rn(workingDirectory, operationArgs[0], operationArgs[1]);

  } else if (operation === 'cp') {
    //cp path_to_file path_to_new_directory
    await cp(workingDirectory, operationArgs[0], operationArgs[1]);

  } else if (operation === 'mv') {
    //cp + remove source file
    try {
      let copyResult = await cp(workingDirectory, operationArgs[0], operationArgs[1]);
      if (copyResult['result']) await remove(workingDirectory, operationArgs[0]);
    } catch (error) {
      console.log('Operation failed: error deleting source file due to not finishing copying')
    }

  } else if (operation === 'rm') {
    //cp path_to_file path_to_new_directory
    await remove(workingDirectory, operationArgs[0]);

  } else if (operation === 'hash') {
    //hash path_to_file
    await calculateHash(workingDirectory, operationArgs[0], operationArgs[1]);

  } else if (operation === 'compress') {
    // compress path_to_file path_to_destination
    await compress(workingDirectory, operationArgs[0], operationArgs[1]);

  } else if (operation === 'decompress') {
    // decompress path_to_file path_to_destination
    await decompress(workingDirectory, operationArgs[0], operationArgs[1]);

  } else {
    // let result = await processOperaton();
    stdout.write(`Вы ввели существующую команду: ${operation}\n`);
  }
  stdout.write(`You are currently in ${workingDirectory}\n`);

});

function handleExit() {
  stdout.write(`\nThank you for using File Manager, ${userName}!\n`);
  process.exit();
}

process.on('SIGINT', () => handleExit());  // CTRL+C