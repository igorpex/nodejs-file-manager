import { createWriteStream } from 'fs';
import { join } from 'path';
import { parseArgs } from './cli/args.mjs';
import os from 'os';

const homeDir = os.homedir();

let workingDirectory = homeDir;

import { getDirname } from './utils.js';
const __dirname = getDirname(import.meta.url);

const userName = parseArgs()['username'];

const { stdin, stdout } = process;

stdout.write(`Welcome to the File Manager, ${userName}! Введите "exit" или нажмите Ctrl+C для окончания записи.\n`);
stdout.write(`You are currently in ${workingDirectory}\n`);

stdin.on('data', chunk => {
  if (chunk.toString().trim() === '.exit') {
    handleExit();
  }
  stdout.write(`Вы ввели: ${chunk}`);
  stdout.write(`You are currently in ${workingDirectory}\n`);


});

function handleExit() {
  stdout.write(`\nThank you for using File Manager, ${userName}!\n`);
  process.exit();
}

process.on('SIGINT', () => handleExit());  // CTRL+C